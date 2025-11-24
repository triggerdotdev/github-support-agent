import {
  TriggerTracer
} from "./chunk-IORKQ53J.mjs";
import {
  SemanticInternalAttributes,
  TaskRunPromise,
  TimezonesResult,
  accessoryAttributes,
  apiClientManager,
  conditionallyImportPacket,
  createErrorTaskError,
  defaultRetryOptions,
  flattenIdempotencyKey,
  getEnvVar,
  lifecycleHooks,
  makeIdempotencyKey,
  mergeRequestOptions,
  parsePacket,
  realtimeStreams,
  resourceCatalog,
  runMetadata,
  runtime,
  stringifyIO,
  taskContext,
  timeout,
  zodfetch
} from "./chunk-LJVEFIEN.mjs";
import {
  SpanKind,
  SpanStatusCode,
  init_esm as init_esm2
} from "./chunk-IA2HBA2V.mjs";
import {
  __export,
  __name,
  init_esm
} from "./chunk-244PAGAH.mjs";

// node_modules/@trigger.dev/sdk/dist/esm/v3/config.js
init_esm();
function defineConfig(config) {
  return config;
}
__name(defineConfig, "defineConfig");

// node_modules/@trigger.dev/sdk/dist/esm/v3/tasks.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/hooks.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/shared.js
init_esm();
init_esm2();

// node_modules/@trigger.dev/sdk/dist/esm/v3/tracer.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/version.js
init_esm();
var VERSION = "4.1.2";

// node_modules/@trigger.dev/sdk/dist/esm/v3/tracer.js
var tracer = new TriggerTracer({ name: "@trigger.dev/sdk", version: VERSION });

// node_modules/@trigger.dev/sdk/dist/esm/v3/shared.js
function createTask(params) {
  const task3 = {
    id: params.id,
    description: params.description,
    jsonSchema: params.jsonSchema,
    trigger: /* @__PURE__ */ __name(async (payload, options) => {
      return await trigger_internal("trigger()", params.id, payload, void 0, {
        queue: params.queue?.name,
        ...options
      });
    }, "trigger"),
    batchTrigger: /* @__PURE__ */ __name(async (items, options) => {
      return await batchTrigger_internal("batchTrigger()", params.id, items, options, void 0, void 0, params.queue?.name);
    }, "batchTrigger"),
    triggerAndWait: /* @__PURE__ */ __name((payload, options, requestOptions) => {
      return new TaskRunPromise((resolve, reject) => {
        triggerAndWait_internal("triggerAndWait()", params.id, payload, void 0, {
          queue: params.queue?.name,
          ...options
        }, requestOptions).then((result) => {
          resolve(result);
        }).catch((error) => {
          reject(error);
        });
      }, params.id);
    }, "triggerAndWait"),
    batchTriggerAndWait: /* @__PURE__ */ __name(async (items, options) => {
      return await batchTriggerAndWait_internal("batchTriggerAndWait()", params.id, items, void 0, options, void 0, params.queue?.name);
    }, "batchTriggerAndWait")
  };
  registerTaskLifecycleHooks(params.id, params);
  resourceCatalog.registerTaskMetadata({
    id: params.id,
    description: params.description,
    queue: params.queue,
    retry: params.retry ? { ...defaultRetryOptions, ...params.retry } : void 0,
    machine: typeof params.machine === "string" ? { preset: params.machine } : params.machine,
    maxDuration: params.maxDuration,
    payloadSchema: params.jsonSchema,
    fns: {
      run: params.run
    }
  });
  const queue2 = params.queue;
  if (queue2 && typeof queue2.name === "string") {
    resourceCatalog.registerQueueMetadata({
      name: queue2.name,
      concurrencyLimit: queue2.concurrencyLimit
    });
  }
  task3[Symbol.for("trigger.dev/task")] = true;
  return task3;
}
__name(createTask, "createTask");
async function trigger_internal(name2, id, payload, parsePayload, options, requestOptions) {
  const apiClient = apiClientManager.clientOrThrow(requestOptions?.clientConfig);
  const parsedPayload = parsePayload ? await parsePayload(payload) : payload;
  const payloadPacket = await stringifyIO(parsedPayload);
  const handle = await apiClient.triggerTask(id, {
    payload: payloadPacket.data,
    options: {
      queue: options?.queue ? { name: options.queue } : void 0,
      concurrencyKey: options?.concurrencyKey,
      test: taskContext.ctx?.run.isTest,
      payloadType: payloadPacket.dataType,
      idempotencyKey: await makeIdempotencyKey(options?.idempotencyKey),
      idempotencyKeyTTL: options?.idempotencyKeyTTL,
      delay: options?.delay,
      ttl: options?.ttl,
      tags: options?.tags,
      maxAttempts: options?.maxAttempts,
      metadata: options?.metadata,
      maxDuration: options?.maxDuration,
      parentRunId: taskContext.ctx?.run.id,
      machine: options?.machine,
      priority: options?.priority,
      region: options?.region,
      lockToVersion: options?.version ?? getEnvVar("TRIGGER_VERSION")
    }
  }, {
    spanParentAsLink: true
  }, {
    name: name2,
    tracer,
    icon: "trigger",
    onResponseBody: /* @__PURE__ */ __name((body, span) => {
      if (body && typeof body === "object" && !Array.isArray(body)) {
        if ("id" in body && typeof body.id === "string") {
          span.setAttribute("runId", body.id);
        }
      }
    }, "onResponseBody"),
    ...requestOptions
  });
  return handle;
}
__name(trigger_internal, "trigger_internal");
async function batchTrigger_internal(name2, taskIdentifier, items, options, parsePayload, requestOptions, queue2) {
  const apiClient = apiClientManager.clientOrThrow(requestOptions?.clientConfig);
  const ctx = taskContext.ctx;
  const response = await apiClient.batchTriggerV3({
    items: await Promise.all(items.map(async (item, index) => {
      const parsedPayload = parsePayload ? await parsePayload(item.payload) : item.payload;
      const payloadPacket = await stringifyIO(parsedPayload);
      const batchItemIdempotencyKey = await makeIdempotencyKey(flattenIdempotencyKey([options?.idempotencyKey, `${index}`]));
      return {
        task: taskIdentifier,
        payload: payloadPacket.data,
        options: {
          queue: item.options?.queue ? { name: item.options.queue } : queue2 ? { name: queue2 } : void 0,
          concurrencyKey: item.options?.concurrencyKey,
          test: taskContext.ctx?.run.isTest,
          payloadType: payloadPacket.dataType,
          delay: item.options?.delay,
          ttl: item.options?.ttl,
          tags: item.options?.tags,
          maxAttempts: item.options?.maxAttempts,
          metadata: item.options?.metadata,
          maxDuration: item.options?.maxDuration,
          idempotencyKey: await makeIdempotencyKey(item.options?.idempotencyKey) ?? batchItemIdempotencyKey,
          idempotencyKeyTTL: item.options?.idempotencyKeyTTL ?? options?.idempotencyKeyTTL,
          machine: item.options?.machine,
          priority: item.options?.priority,
          region: item.options?.region,
          lockToVersion: item.options?.version ?? getEnvVar("TRIGGER_VERSION")
        }
      };
    })),
    parentRunId: ctx?.run.id
  }, {
    spanParentAsLink: true,
    processingStrategy: options?.triggerSequentially ? "sequential" : void 0
  }, {
    name: name2,
    tracer,
    icon: "trigger",
    onResponseBody(body, span) {
      if (body && typeof body === "object" && !Array.isArray(body)) {
        if ("id" in body && typeof body.id === "string") {
          span.setAttribute("batchId", body.id);
        }
        if ("runCount" in body && Array.isArray(body.runCount)) {
          span.setAttribute("runCount", body.runCount);
        }
      }
    },
    ...requestOptions
  });
  const handle = {
    batchId: response.id,
    runCount: response.runCount,
    publicAccessToken: response.publicAccessToken
  };
  return handle;
}
__name(batchTrigger_internal, "batchTrigger_internal");
async function triggerAndWait_internal(name2, id, payload, parsePayload, options, requestOptions) {
  const ctx = taskContext.ctx;
  if (!ctx) {
    throw new Error("triggerAndWait can only be used from inside a task.run()");
  }
  const apiClient = apiClientManager.clientOrThrow(requestOptions?.clientConfig);
  const parsedPayload = parsePayload ? await parsePayload(payload) : payload;
  const payloadPacket = await stringifyIO(parsedPayload);
  return await tracer.startActiveSpan(name2, async (span) => {
    const response = await apiClient.triggerTask(id, {
      payload: payloadPacket.data,
      options: {
        lockToVersion: taskContext.worker?.version,
        // Lock to current version because we're waiting for it to finish
        queue: options?.queue ? { name: options.queue } : void 0,
        concurrencyKey: options?.concurrencyKey,
        test: taskContext.ctx?.run.isTest,
        payloadType: payloadPacket.dataType,
        delay: options?.delay,
        ttl: options?.ttl,
        tags: options?.tags,
        maxAttempts: options?.maxAttempts,
        metadata: options?.metadata,
        maxDuration: options?.maxDuration,
        resumeParentOnCompletion: true,
        parentRunId: ctx.run.id,
        idempotencyKey: await makeIdempotencyKey(options?.idempotencyKey),
        idempotencyKeyTTL: options?.idempotencyKeyTTL,
        machine: options?.machine,
        priority: options?.priority,
        region: options?.region
      }
    }, {}, requestOptions);
    span.setAttribute("runId", response.id);
    const result = await runtime.waitForTask({
      id: response.id,
      ctx
    });
    return await handleTaskRunExecutionResult(result, id);
  }, {
    kind: SpanKind.PRODUCER,
    attributes: {
      [SemanticInternalAttributes.STYLE_ICON]: "trigger",
      ...accessoryAttributes({
        items: [
          {
            text: id,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  });
}
__name(triggerAndWait_internal, "triggerAndWait_internal");
async function batchTriggerAndWait_internal(name2, id, items, parsePayload, options, requestOptions, queue2) {
  const ctx = taskContext.ctx;
  if (!ctx) {
    throw new Error("batchTriggerAndWait can only be used from inside a task.run()");
  }
  const apiClient = apiClientManager.clientOrThrow(requestOptions?.clientConfig);
  return await tracer.startActiveSpan(name2, async (span) => {
    const response = await apiClient.batchTriggerV3({
      items: await Promise.all(items.map(async (item, index) => {
        const parsedPayload = parsePayload ? await parsePayload(item.payload) : item.payload;
        const payloadPacket = await stringifyIO(parsedPayload);
        const batchItemIdempotencyKey = await makeIdempotencyKey(flattenIdempotencyKey([options?.idempotencyKey, `${index}`]));
        return {
          task: id,
          payload: payloadPacket.data,
          options: {
            lockToVersion: taskContext.worker?.version,
            queue: item.options?.queue ? { name: item.options.queue } : queue2 ? { name: queue2 } : void 0,
            concurrencyKey: item.options?.concurrencyKey,
            test: taskContext.ctx?.run.isTest,
            payloadType: payloadPacket.dataType,
            delay: item.options?.delay,
            ttl: item.options?.ttl,
            tags: item.options?.tags,
            maxAttempts: item.options?.maxAttempts,
            metadata: item.options?.metadata,
            maxDuration: item.options?.maxDuration,
            idempotencyKey: await makeIdempotencyKey(item.options?.idempotencyKey) ?? batchItemIdempotencyKey,
            idempotencyKeyTTL: item.options?.idempotencyKeyTTL ?? options?.idempotencyKeyTTL,
            machine: item.options?.machine,
            priority: item.options?.priority,
            region: item.options?.region
          }
        };
      })),
      resumeParentOnCompletion: true,
      parentRunId: ctx.run.id
    }, {
      processingStrategy: options?.triggerSequentially ? "sequential" : void 0
    }, requestOptions);
    span.setAttribute("batchId", response.id);
    span.setAttribute("runCount", response.runCount);
    const result = await runtime.waitForBatch({
      id: response.id,
      runCount: response.runCount,
      ctx
    });
    const runs2 = await handleBatchTaskRunExecutionResult(result.items, id);
    return {
      id: result.id,
      runs: runs2
    };
  }, {
    kind: SpanKind.PRODUCER,
    attributes: {
      [SemanticInternalAttributes.STYLE_ICON]: "trigger",
      ...accessoryAttributes({
        items: [
          {
            text: id,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  });
}
__name(batchTriggerAndWait_internal, "batchTriggerAndWait_internal");
async function handleBatchTaskRunExecutionResult(items, taskIdentifier) {
  const someObjectStoreOutputs = items.some((item) => item.ok && item.outputType === "application/store");
  if (!someObjectStoreOutputs) {
    const results = await Promise.all(items.map(async (item) => {
      return await handleTaskRunExecutionResult(item, taskIdentifier);
    }));
    return results;
  }
  return await tracer.startActiveSpan("store.downloadPayloads", async (span) => {
    const results = await Promise.all(items.map(async (item) => {
      return await handleTaskRunExecutionResult(item, taskIdentifier);
    }));
    return results;
  }, {
    kind: SpanKind.INTERNAL,
    [SemanticInternalAttributes.STYLE_ICON]: "cloud-download"
  });
}
__name(handleBatchTaskRunExecutionResult, "handleBatchTaskRunExecutionResult");
async function handleTaskRunExecutionResult(execution, taskIdentifier) {
  if (execution.ok) {
    const outputPacket = { data: execution.output, dataType: execution.outputType };
    const importedPacket = await conditionallyImportPacket(outputPacket, tracer);
    return {
      ok: true,
      id: execution.id,
      taskIdentifier: execution.taskIdentifier ?? taskIdentifier,
      output: await parsePacket(importedPacket)
    };
  } else {
    return {
      ok: false,
      id: execution.id,
      taskIdentifier: execution.taskIdentifier ?? taskIdentifier,
      error: createErrorTaskError(execution.error)
    };
  }
}
__name(handleTaskRunExecutionResult, "handleTaskRunExecutionResult");
function registerTaskLifecycleHooks(taskId, params) {
  if (params.init) {
    lifecycleHooks.registerTaskInitHook(taskId, {
      fn: params.init
    });
  }
  if (params.onStart) {
    lifecycleHooks.registerTaskStartHook(taskId, {
      fn: params.onStart
    });
  }
  if (params.onStartAttempt) {
    lifecycleHooks.registerTaskStartAttemptHook(taskId, {
      fn: params.onStartAttempt
    });
  }
  if (params.onFailure) {
    lifecycleHooks.registerTaskFailureHook(taskId, {
      fn: params.onFailure
    });
  }
  if (params.onSuccess) {
    lifecycleHooks.registerTaskSuccessHook(taskId, {
      fn: params.onSuccess
    });
  }
  if (params.onComplete) {
    lifecycleHooks.registerTaskCompleteHook(taskId, {
      fn: params.onComplete
    });
  }
  if (params.onWait) {
    lifecycleHooks.registerTaskWaitHook(taskId, {
      fn: params.onWait
    });
  }
  if (params.onResume) {
    lifecycleHooks.registerTaskResumeHook(taskId, {
      fn: params.onResume
    });
  }
  if (params.catchError) {
    lifecycleHooks.registerTaskCatchErrorHook(taskId, {
      fn: params.catchError
    });
  }
  if (params.handleError) {
    lifecycleHooks.registerTaskCatchErrorHook(taskId, {
      fn: params.handleError
    });
  }
  if (params.middleware) {
    lifecycleHooks.registerTaskMiddlewareHook(taskId, {
      fn: params.middleware
    });
  }
  if (params.cleanup) {
    lifecycleHooks.registerTaskCleanupHook(taskId, {
      fn: params.cleanup
    });
  }
  if (params.onCancel) {
    lifecycleHooks.registerTaskCancelHook(taskId, {
      fn: params.onCancel
    });
  }
}
__name(registerTaskLifecycleHooks, "registerTaskLifecycleHooks");

// node_modules/@trigger.dev/sdk/dist/esm/v3/tasks.js
var task = createTask;

// node_modules/@trigger.dev/sdk/dist/esm/v3/schedules/index.js
var schedules_exports = {};
__export(schedules_exports, {
  activate: () => activate,
  create: () => create,
  deactivate: () => deactivate,
  del: () => del,
  list: () => list,
  retrieve: () => retrieve,
  task: () => task2,
  timezones: () => timezones,
  update: () => update
});
init_esm();
function task2(params) {
  const task3 = createTask(params);
  const cron = params.cron ? typeof params.cron === "string" ? params.cron : params.cron.pattern : void 0;
  const timezone = (params.cron && typeof params.cron !== "string" ? params.cron.timezone : "UTC") ?? "UTC";
  const environments = params.cron && typeof params.cron !== "string" ? params.cron.environments : void 0;
  resourceCatalog.updateTaskMetadata(task3.id, {
    triggerSource: "schedule",
    schedule: cron ? {
      cron,
      timezone,
      environments
    } : void 0
  });
  return task3;
}
__name(task2, "task");
function create(options, requestOptions) {
  const apiClient = apiClientManager.clientOrThrow();
  const $requestOptions = mergeRequestOptions({
    tracer,
    name: "schedules.create()",
    icon: "clock",
    attributes: {
      ...accessoryAttributes({
        items: [
          {
            text: options.cron,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  }, requestOptions);
  return apiClient.createSchedule(options, $requestOptions);
}
__name(create, "create");
function retrieve(scheduleId, requestOptions) {
  const apiClient = apiClientManager.clientOrThrow();
  const $requestOptions = mergeRequestOptions({
    tracer,
    name: "schedules.retrieve()",
    icon: "clock",
    attributes: {
      scheduleId,
      ...accessoryAttributes({
        items: [
          {
            text: scheduleId,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  }, requestOptions);
  return apiClient.retrieveSchedule(scheduleId, $requestOptions);
}
__name(retrieve, "retrieve");
function update(scheduleId, options, requestOptions) {
  const apiClient = apiClientManager.clientOrThrow();
  const $requestOptions = mergeRequestOptions({
    tracer,
    name: "schedules.update()",
    icon: "clock",
    attributes: {
      scheduleId,
      ...accessoryAttributes({
        items: [
          {
            text: scheduleId,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  }, requestOptions);
  return apiClient.updateSchedule(scheduleId, options, $requestOptions);
}
__name(update, "update");
function del(scheduleId, requestOptions) {
  const apiClient = apiClientManager.clientOrThrow();
  const $requestOptions = mergeRequestOptions({
    tracer,
    name: "schedules.delete()",
    icon: "clock",
    attributes: {
      scheduleId,
      ...accessoryAttributes({
        items: [
          {
            text: scheduleId,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  }, requestOptions);
  return apiClient.deleteSchedule(scheduleId, $requestOptions);
}
__name(del, "del");
function deactivate(scheduleId, requestOptions) {
  const apiClient = apiClientManager.clientOrThrow();
  const $requestOptions = mergeRequestOptions({
    tracer,
    name: "schedules.deactivate()",
    icon: "clock",
    attributes: {
      scheduleId,
      ...accessoryAttributes({
        items: [
          {
            text: scheduleId,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  }, requestOptions);
  return apiClient.deactivateSchedule(scheduleId, $requestOptions);
}
__name(deactivate, "deactivate");
function activate(scheduleId, requestOptions) {
  const apiClient = apiClientManager.clientOrThrow();
  const $requestOptions = mergeRequestOptions({
    tracer,
    name: "schedules.activate()",
    icon: "clock",
    attributes: {
      scheduleId,
      ...accessoryAttributes({
        items: [
          {
            text: scheduleId,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  }, requestOptions);
  return apiClient.activateSchedule(scheduleId, $requestOptions);
}
__name(activate, "activate");
function list(options, requestOptions) {
  const apiClient = apiClientManager.clientOrThrow();
  const $requestOptions = mergeRequestOptions({
    tracer,
    name: "schedules.list()",
    icon: "clock"
  }, requestOptions);
  return apiClient.listSchedules(options, $requestOptions);
}
__name(list, "list");
function timezones(options) {
  const baseUrl = apiClientManager.baseURL;
  return zodfetch(TimezonesResult, `${baseUrl}/api/v1/timezones${options?.excludeUtc === true ? "?excludeUtc=true" : ""}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
}
__name(timezones, "timezones");

// node_modules/@trigger.dev/sdk/dist/esm/v3/index.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/cache.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/retry.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/wait.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/batch.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/waitUntil.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/usage.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/idempotencyKeys.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/tags.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/metadata.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/streams.js
init_esm();
init_esm2();
var DEFAULT_STREAM_KEY = "default";
function pipe(keyOrValue, valueOrOptions, options) {
  let key;
  let value;
  let opts;
  if (typeof keyOrValue === "string") {
    key = keyOrValue;
    value = valueOrOptions;
    opts = options;
  } else {
    key = DEFAULT_STREAM_KEY;
    value = keyOrValue;
    opts = valueOrOptions;
  }
  return pipeInternal(key, value, opts, "streams.pipe()");
}
__name(pipe, "pipe");
function pipeInternal(key, value, opts, spanName) {
  const runId = getRunIdForOptions(opts);
  if (!runId) {
    throw new Error("Could not determine the target run ID for the realtime stream. Please specify a target run ID using the `target` option or use this function from inside a task.");
  }
  const span = tracer.startSpan(spanName, {
    attributes: {
      key,
      runId,
      [SemanticInternalAttributes.ENTITY_TYPE]: "realtime-stream",
      [SemanticInternalAttributes.ENTITY_ID]: `${runId}:${key}`,
      [SemanticInternalAttributes.STYLE_ICON]: "streams",
      ...accessoryAttributes({
        items: [
          {
            text: key,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  });
  const requestOptions = mergeRequestOptions({}, opts?.requestOptions);
  try {
    const instance = realtimeStreams.pipe(key, value, {
      signal: opts?.signal,
      target: runId,
      requestOptions
    });
    instance.wait().finally(() => {
      span.end();
    });
    return {
      stream: instance.stream,
      waitUntilComplete: /* @__PURE__ */ __name(() => instance.wait(), "waitUntilComplete")
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      span.end();
      throw error;
    }
    if (error instanceof Error || typeof error === "string") {
      span.recordException(error);
    } else {
      span.recordException(String(error));
    }
    span.setStatus({ code: SpanStatusCode.ERROR });
    span.end();
    throw error;
  }
}
__name(pipeInternal, "pipeInternal");
async function read(runId, keyOrOptions, options) {
  let key;
  let opts;
  if (typeof keyOrOptions === "string") {
    key = keyOrOptions;
    opts = options;
  } else {
    key = DEFAULT_STREAM_KEY;
    opts = keyOrOptions;
  }
  return readStreamImpl(runId, key, opts);
}
__name(read, "read");
async function readStreamImpl(runId, key, options) {
  const apiClient = apiClientManager.clientOrThrow();
  const span = tracer.startSpan("streams.read()", {
    attributes: {
      key,
      runId,
      [SemanticInternalAttributes.ENTITY_TYPE]: "realtime-stream",
      [SemanticInternalAttributes.ENTITY_ID]: `${runId}:${key}`,
      [SemanticInternalAttributes.ENTITY_METADATA]: JSON.stringify({
        startIndex: options?.startIndex
      }),
      [SemanticInternalAttributes.STYLE_ICON]: "streams",
      ...accessoryAttributes({
        items: [
          {
            text: key,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  });
  return await apiClient.fetchStream(runId, key, {
    signal: options?.signal,
    timeoutInSeconds: options?.timeoutInSeconds ?? 60,
    lastEventId: options?.startIndex ? (options.startIndex - 1).toString() : void 0,
    onComplete: /* @__PURE__ */ __name(() => {
      span.end();
    }, "onComplete"),
    onError: /* @__PURE__ */ __name((error) => {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      span.end();
    }, "onError")
  });
}
__name(readStreamImpl, "readStreamImpl");
function append(keyOrValue, valueOrOptions, options) {
  if (typeof keyOrValue === "string" && typeof valueOrOptions === "string") {
    return appendInternal(keyOrValue, valueOrOptions, options);
  }
  if (typeof keyOrValue === "string") {
    if (isAppendStreamOptions(valueOrOptions)) {
      return appendInternal(DEFAULT_STREAM_KEY, keyOrValue, valueOrOptions);
    } else {
      if (!valueOrOptions) {
        return appendInternal(DEFAULT_STREAM_KEY, keyOrValue, options);
      }
      return appendInternal(keyOrValue, valueOrOptions, options);
    }
  } else {
    if (isAppendStreamOptions(valueOrOptions)) {
      return appendInternal(DEFAULT_STREAM_KEY, keyOrValue, valueOrOptions);
    } else {
      return appendInternal(DEFAULT_STREAM_KEY, keyOrValue, options);
    }
  }
}
__name(append, "append");
async function appendInternal(key, part, options) {
  const runId = getRunIdForOptions(options);
  if (!runId) {
    throw new Error("Could not determine the target run ID for the realtime stream. Please specify a target run ID using the `target` option or use this function from inside a task.");
  }
  const span = tracer.startSpan("streams.append()", {
    attributes: {
      key,
      runId,
      [SemanticInternalAttributes.ENTITY_TYPE]: "realtime-stream",
      [SemanticInternalAttributes.ENTITY_ID]: `${runId}:${key}`,
      [SemanticInternalAttributes.STYLE_ICON]: "streams",
      ...accessoryAttributes({
        items: [
          {
            text: key,
            variant: "normal"
          }
        ],
        style: "codepath"
      })
    }
  });
  try {
    await realtimeStreams.append(key, part, options);
    span.end();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      span.end();
      throw error;
    }
    if (error instanceof Error || typeof error === "string") {
      span.recordException(error);
    } else {
      span.recordException(String(error));
    }
    span.setStatus({ code: SpanStatusCode.ERROR });
    span.end();
    throw error;
  }
}
__name(appendInternal, "appendInternal");
function isAppendStreamOptions(val) {
  return typeof val === "object" && val !== null && !Array.isArray(val) && ("target" in val && typeof val.target === "string" || "requestOptions" in val && typeof val.requestOptions === "object");
}
__name(isAppendStreamOptions, "isAppendStreamOptions");
function writer(keyOrOptions, valueOrOptions) {
  if (typeof keyOrOptions === "string") {
    return writerInternal(keyOrOptions, valueOrOptions);
  }
  return writerInternal(DEFAULT_STREAM_KEY, keyOrOptions);
}
__name(writer, "writer");
function writerInternal(key, options) {
  let controller;
  const ongoingStreamPromises = [];
  const stream2 = new ReadableStream({
    start(controllerArg) {
      controller = controllerArg;
    }
  });
  function safeEnqueue(data) {
    try {
      controller.enqueue(data);
    } catch (error) {
    }
  }
  __name(safeEnqueue, "safeEnqueue");
  try {
    const result = options.execute({
      write(part) {
        safeEnqueue(part);
      },
      merge(streamArg) {
        ongoingStreamPromises.push((async () => {
          const reader = streamArg.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done)
              break;
            safeEnqueue(value);
          }
        })().catch((error) => {
          console.error(error);
        }));
      }
    });
    if (result) {
      ongoingStreamPromises.push(result.catch((error) => {
        console.error(error);
      }));
    }
  } catch (error) {
    console.error(error);
  }
  const waitForStreams = new Promise((resolve, reject) => {
    (async () => {
      while (ongoingStreamPromises.length > 0) {
        await ongoingStreamPromises.shift();
      }
      resolve();
    })().catch(reject);
  });
  waitForStreams.finally(() => {
    try {
      controller.close();
    } catch (error) {
    }
  });
  return pipeInternal(key, stream2, options, "streams.writer()");
}
__name(writerInternal, "writerInternal");
function define(opts) {
  return {
    id: opts.id,
    pipe(value, options) {
      return pipe(opts.id, value, options);
    },
    read(runId, options) {
      return read(runId, opts.id, options);
    },
    append(value, options) {
      return append(opts.id, value, options);
    },
    writer(options) {
      return writer(opts.id, options);
    }
  };
}
__name(define, "define");
var streams = {
  pipe,
  read,
  append,
  writer,
  define
};
function getRunIdForOptions(options) {
  if (options?.target) {
    if (options.target === "parent") {
      return taskContext.ctx?.run?.parentTaskRunId;
    }
    if (options.target === "root") {
      return taskContext.ctx?.run?.rootTaskRunId;
    }
    if (options.target === "self") {
      return taskContext.ctx?.run?.id;
    }
    return options.target;
  }
  return taskContext.ctx?.run?.id;
}
__name(getRunIdForOptions, "getRunIdForOptions");

// node_modules/@trigger.dev/sdk/dist/esm/v3/metadata.js
var parentMetadataUpdater = runMetadata.parent;
var rootMetadataUpdater = runMetadata.root;
var metadataUpdater = {
  set: setMetadataKey,
  del: deleteMetadataKey,
  append: appendMetadataKey,
  remove: removeMetadataKey,
  increment: incrementMetadataKey,
  decrement: decrementMetadataKey,
  flush: flushMetadata
};
var metadata = {
  current: currentMetadata,
  get: getMetadataKey,
  save: saveMetadata,
  replace: replaceMetadata,
  stream,
  fetchStream,
  parent: parentMetadataUpdater,
  root: rootMetadataUpdater,
  refresh: refreshMetadata,
  ...metadataUpdater
};
function currentMetadata() {
  return runMetadata.current();
}
__name(currentMetadata, "currentMetadata");
function getMetadataKey(key) {
  return runMetadata.getKey(key);
}
__name(getMetadataKey, "getMetadataKey");
function setMetadataKey(key, value) {
  runMetadata.set(key, value);
  return metadataUpdater;
}
__name(setMetadataKey, "setMetadataKey");
function deleteMetadataKey(key) {
  runMetadata.del(key);
  return metadataUpdater;
}
__name(deleteMetadataKey, "deleteMetadataKey");
function replaceMetadata(metadata2) {
  runMetadata.update(metadata2);
}
__name(replaceMetadata, "replaceMetadata");
function saveMetadata(metadata2) {
  runMetadata.update(metadata2);
}
__name(saveMetadata, "saveMetadata");
function incrementMetadataKey(key, value = 1) {
  runMetadata.increment(key, value);
  return metadataUpdater;
}
__name(incrementMetadataKey, "incrementMetadataKey");
function decrementMetadataKey(key, value = 1) {
  runMetadata.decrement(key, value);
  return metadataUpdater;
}
__name(decrementMetadataKey, "decrementMetadataKey");
function appendMetadataKey(key, value) {
  runMetadata.append(key, value);
  return metadataUpdater;
}
__name(appendMetadataKey, "appendMetadataKey");
function removeMetadataKey(key, value) {
  runMetadata.remove(key, value);
  return metadataUpdater;
}
__name(removeMetadataKey, "removeMetadataKey");
async function flushMetadata(requestOptions) {
  const $requestOptions = mergeRequestOptions({
    tracer,
    name: "metadata.flush()",
    icon: "code-plus"
  }, requestOptions);
  await runMetadata.flush($requestOptions);
}
__name(flushMetadata, "flushMetadata");
async function refreshMetadata(requestOptions) {
  const $requestOptions = mergeRequestOptions({
    tracer,
    name: "metadata.refresh()",
    icon: "code-plus"
  }, requestOptions);
  await runMetadata.refresh($requestOptions);
}
__name(refreshMetadata, "refreshMetadata");
async function stream(key, value, signal) {
  const streamInstance = await streams.pipe(key, value, {
    signal
  });
  return streamInstance.stream;
}
__name(stream, "stream");
async function fetchStream(key, signal) {
  return runMetadata.fetchStream(key, signal);
}
__name(fetchStream, "fetchStream");

// node_modules/@trigger.dev/sdk/dist/esm/v3/timeout.js
init_esm();
var MAXIMUM_MAX_DURATION = 2147483647;
var timeout2 = {
  None: MAXIMUM_MAX_DURATION,
  signal: timeout.signal
};

// node_modules/@trigger.dev/sdk/dist/esm/v3/webhooks.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/imports/uncrypto.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/locals.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/otel.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/schemas.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/heartbeats.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/runs.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/envvars.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/queues.js
init_esm();

// node_modules/@trigger.dev/sdk/dist/esm/v3/auth.js
init_esm();

export {
  defineConfig,
  task,
  schedules_exports
};
//# sourceMappingURL=chunk-4IHIUCUY.mjs.map
