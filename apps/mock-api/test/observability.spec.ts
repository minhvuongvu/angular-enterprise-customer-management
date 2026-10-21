import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { ACCESS_COOKIE_NAME, CORRELATION_ID_HEADER, REDACTED } from '@ecm/contracts';
import { MockApiLogger } from '../src/logging/logger.ts';
import { startTestServer, type TestServer } from './helpers.ts';

/**
 * The server's half of observability (docs/observability.md): every request
 * is logged once, under the correlation id the browser sent, and nothing
 * secret or personal reaches the log.
 *
 * Assertions read the logger's buffer, which is written through the same
 * redaction as stdout - so "not in the buffer" means "not in the log".
 */
describe('request log', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await startTestServer();
  });

  afterAll(() => server.close());

  function serialisedLog(): string {
    return JSON.stringify(server.logger.entries());
  }

  it("logs each request under the caller's correlation id, and echoes it back", async () => {
    const client = server.client();
    await client.login('admin');

    const response = await client.call('/api/customers?page=1', {
      headers: { [CORRELATION_ID_HEADER]: 'test-correlation-1' },
    });

    expect(response.headers.get(CORRELATION_ID_HEADER)).toBe('test-correlation-1');
    const [entry] = server.logger.entries('test-correlation-1');
    expect(entry).toMatchObject({
      level: 'info',
      message: 'HTTP request completed',
      service: 'mock-api',
      method: 'GET',
      route: '/api/customers',
      status: 200,
      role: 'ADMIN',
    });
    expect(typeof entry?.['durationMs']).toBe('number');
  });

  it('gives a request without an id one of its own, so nothing is untraceable', async () => {
    const response = await server.client().call('/api/health');
    const generated = response.headers.get(CORRELATION_ID_HEADER) ?? '';

    expect(generated).toMatch(/^[0-9a-f-]{36}$/);
    expect(server.logger.entries(generated)).toHaveLength(1);
  });

  it('logs the route template, never the query string a search puts a name into', async () => {
    const client = server.client();
    await client.login('admin');
    const id = server.store.list({ page: 1, size: 1, sort: 'updatedAt,desc' }).items[0]?.id ?? '';

    await client.call(`/api/customers?search=${encodeURIComponent('Nguyễn Văn A')}`, {
      headers: { [CORRELATION_ID_HEADER]: 'search-1' },
    });
    await client.call(`/api/customers/${id}`, { headers: { [CORRELATION_ID_HEADER]: 'detail-1' } });

    expect(server.logger.entries('search-1')[0]?.['route']).toBe('/api/customers');
    expect(server.logger.entries('detail-1')[0]?.['route']).toBe('/api/customers/:id');
    expect(serialisedLog()).not.toContain('Nguy');
    expect(serialisedLog()).not.toContain(id);
  });

  it('never logs a password, a token or a cookie - not even on a sign-in', async () => {
    const client = server.client();
    await client.call('/api/auth/login', {
      method: 'POST',
      body: { username: 'admin', password: 'correct-horse-battery-staple' },
      csrf: false,
      headers: { [CORRELATION_ID_HEADER]: 'login-1' },
    });
    const session = client.cookie(ACCESS_COOKIE_NAME) ?? '';

    const log = serialisedLog();
    expect(log).not.toContain('correct-horse-battery-staple');
    expect(session).not.toBe('');
    expect(log).not.toContain(session);
    expect(server.logger.entries('login-1')[0]?.['status']).toBe(200);
  });

  it('logs a 5xx as an error with its stack, and masks personal data inside the text', async () => {
    const client = server.client();
    await client.call('/api/health', {
      scenario: 'server-error',
      headers: { [CORRELATION_ID_HEADER]: 'failure-1' },
    });

    const entries = server.logger.entries('failure-1');
    expect(entries.map((entry) => entry.message)).toEqual([
      'Unhandled request failure',
      'HTTP request failed',
    ]);
    expect(entries.every((entry) => entry.level === 'error')).toBe(true);
  });

  it('logs a deliberately dropped connection as the server dropping it, with no status', async () => {
    // The socket closes before any response is written, which on its own looks
    // exactly like a client hanging up - and `res.statusCode` is still the
    // 200 Node starts every response with, though nothing was ever sent.
    await expect(
      server.client().call('/api/health', {
        scenario: 'network-drop',
        headers: { [CORRELATION_ID_HEADER]: 'drop-1' },
      }),
    ).rejects.toThrow();

    // The client can see the reset before the server has run its close handlers.
    await vi.waitFor(() => expect(server.logger.entries('drop-1')).toHaveLength(1));
    const [entry] = server.logger.entries('drop-1');
    expect(entry).toMatchObject({
      level: 'warn',
      message: 'HTTP connection dropped by the server',
      scenario: 'network-drop',
      route: '/api/health',
    });
    expect(entry).not.toHaveProperty('status');
  });

  it('still logs a client hanging up as the client, with the status it was sent', async () => {
    const client = server.client();
    await client.login('admin');
    const abort = new AbortController();
    const response = await fetch(`${server.baseUrl}/api/events`, {
      headers: {
        cookie: `${ACCESS_COOKIE_NAME}=${client.cookie(ACCESS_COOKIE_NAME)}`,
        [CORRELATION_ID_HEADER]: 'hang-up-1',
      },
      signal: abort.signal,
    });
    expect(response.status).toBe(200);

    // An event stream only ever ends this way: the browser closes it.
    abort.abort();

    await vi.waitFor(() => expect(server.logger.entries('hang-up-1')).toHaveLength(1));
    expect(server.logger.entries('hang-up-1')[0]).toMatchObject({
      level: 'debug',
      message: 'HTTP request aborted by the client',
      route: '/api/events',
      status: 200,
    });
  });

  it('applies the shared redaction policy to anything a handler logs', () => {
    server.logger.warn('Import rejected a row', {
      correlationId: 'direct-1',
      email: 'an@example.test',
      reason: 'duplicate of binh@example.test',
      accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.c2ln',
    });

    const [entry] = server.logger.entries('direct-1');
    expect(entry?.['email']).toBe(REDACTED);
    expect(entry?.['reason']).toBe('duplicate of [email]');
    expect(entry?.['accessToken']).toBe(REDACTED);
  });

  it('answers "what did you log for this id?" over HTTP, for the E2E suite', async () => {
    const client = server.client();
    await client.call('/api/health', { headers: { [CORRELATION_ID_HEADER]: 'query-1' } });

    const { status, body } = await client.json<{ entries: { correlationId: string }[] }>(
      '/api/_mock/logs?correlationId=query-1',
    );

    expect(status).toBe(200);
    expect(body.entries.map((entry) => entry.correlationId)).toEqual(['query-1']);
  });
});

/**
 * The logger on its own, without a server: the guarantees a caller relies on
 * without reading the class - the same two the browser's logger gives.
 */
describe('MockApiLogger', () => {
  const quietLogger = () => new MockApiLogger({ level: 'info', stdout: false, bufferSize: 10 });

  it('masks an email address and a bearer token in the message, not only in the fields', () => {
    const logger = quietLogger();

    logger.warn('Import rejected binh@example.test, sent with Bearer abc.def', {
      correlationId: 'message-1',
    });

    const [entry] = logger.entries('message-1');
    expect(entry?.message).toBe(`Import rejected [email], sent with Bearer ${REDACTED}`);
  });

  it('keeps the level, time and service it set itself, whatever the fields say', () => {
    const logger = quietLogger();

    logger.error('Disk full', {
      correlationId: 'common-1',
      level: 'debug',
      service: 'web',
      timestamp: 'yesterday',
    });

    const [entry] = logger.entries('common-1');
    expect(entry?.level).toBe('error');
    expect(entry?.service).toBe('mock-api');
    expect(entry?.timestamp).not.toBe('yesterday');
  });
});
