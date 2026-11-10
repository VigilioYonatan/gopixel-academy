/** Explicit capability contract: never label a rule-check or mock as real Go execution. */
export type ExecutionMode = 'go-wasm' | 'simulated' | 'external';
export type ExecutionRequest = {
  source: string;
  mode: ExecutionMode;
  filename?: string;
  timeoutMs?: number;
};
export type ExecutionResult = {
  mode: ExecutionMode;
  status: 'ok' | 'error' | 'unavailable';
  stdout: string;
  stderr: string;
  durationMs?: number;
  disclaimer?: string;
};
export interface GoRunner {
  capabilities: ReadonlySet<ExecutionMode>;
  run(request: ExecutionRequest): Promise<ExecutionResult>;
}
export class UnavailableGoRunner implements GoRunner {
  readonly capabilities = new Set<ExecutionMode>(['external']);
  async run(request: ExecutionRequest): Promise<ExecutionResult> {
    return {
      mode: request.mode,
      status: 'unavailable',
      stdout: '',
      stderr: '',
      disclaimer: 'No se ha integrado un runtime Go WASM compatible. Este proyecto no compila Go.',
    };
  }
}
