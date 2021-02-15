import { App, WatchOptions, InjectionKey } from "vue";

// augment typings of Vue.js
import "./vue";

import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, NamespacedModuleKeys } from "./helpers";
import { createLogger } from "./logger";

export * from "./helpers";
export * from "./logger";

export declare class Store<
S,
G extends GetterTree<S, S, G, G>,
A extends ActionTree<S, S, G, A, M, Modules>,
M extends MutationTree<S>,
Modules extends ModuleTree<S, S, G, A, M, Modules>> {
  constructor(options: StoreOptions<S, G, A, M, Modules>);

  readonly getters: AllGetters<G, Modules>;
  readonly state: AllStates<S, Modules>;

  install(app: App, injectKey?: InjectionKey<Store<any, any, any, any, any>> | string): void;

  replaceState(state: S): void;

  commit: Commit<M, Modules>;
  dispatch: Dispatch<A, Modules>;

  subscribe<P extends MutationPayload>(fn: (mutation: P, state: S) => any, options?: SubscribeOptions): () => void;
  subscribeAction<P extends ActionPayload>(fn: SubscribeActionOptions<P, S>, options?: SubscribeOptions): () => void;
  watch<T>(getter: (state: S, getters: any) => T, cb: (value: T, oldValue: T) => void, options?: WatchOptions): () => void;

  registerModule<T>(path: string, module: Module<T, S, G, ActionTree<T, S, G, A, M, Modules>, M, Modules>, options?: ModuleOptions): void;
  registerModule<T>(path: string[], module: Module<T, S, G, ActionTree<T, S, G, A, M, Modules>, M, Modules>, options?: ModuleOptions): void;

  unregisterModule(path: string): void;
  unregisterModule(path: string[]): void;

  hasModule(path: string): boolean;
  hasModule(path: string[]): boolean;

  hotUpdate(options: {
    actions?: ActionTree<any, any, any, any, any, any>;
    mutations?: MutationTree<any>;
    getters?: GetterTree<any, any, any, any>;
    modules?: ModuleTree<any, any, any, any, any, any>;
  }): void;
}

export const storeKey: string;

export function createStore<
S,
G extends GetterTree<S, S, G, G>,
A extends ActionTree<S, S, G, A, M, Modules>,
M extends MutationTree<S>,
Modules extends ModuleTree<S, S, G, A, M, Modules>
>(options: StoreOptions<S, G, A, M, Modules>): Store<S, G, A, M, Modules>;

export function useStore<S extends Store<any, any, any, any, any>>(injectKey?: InjectionKey<S> | string): S;

export interface Dispatch<Actions extends ActionTree<any, any, any, any, any, any>, Modules extends ModuleTree<any, any, any, any, any, any>> {
  <Action extends keyof AllActionsWithParam<Actions, Modules>>(type: Action, payload: Parameters<AllActionsWithParam<Actions, Modules>[Action]>[1], options?: DispatchOptions): ReturnType<AllActionsWithParam<Actions, Modules>[Action]>;
  <Action extends keyof AllActionsWithoutParam<Actions, Modules>>(type: Action, options?: DispatchOptions): ReturnType<AllActionsWithoutParam<Actions, Modules>[Action]>;
}

export interface Commit<Mutations extends MutationTree<any>, Modules extends ModuleTree<any, any, any, any, any, any>> {
  <Mutation extends keyof AllMutationsWithParam<Mutations, Modules>>(type: Mutation, payload: Parameters<AllMutationsWithParam<Mutations, Modules>[Mutation]>[1], options?: DispatchOptions): ReturnType<AllMutationsWithParam<Mutations, Modules>[Mutation]>;
  <Mutation extends keyof AllMutationsWithoutParam<Mutations, Modules>>(type: Mutation, options?: CommitOptions): ReturnType<AllMutationsWithoutParam<Mutations, Modules>[Mutation]>;
}

export interface ActionContext<S, R, A extends ActionTree<any, any, any, any, any, any>, M extends MutationTree<any>, Modules extends ModuleTree<any, any, any, any, any, any>> {
  dispatch: Dispatch<A, Modules>;
  commit: Commit<M, Modules>;
  state: S;
  getters: any;
  rootState: R;
  rootGetters: any;
}

export interface Payload {
  type: string;
}

export interface MutationPayload extends Payload {
  payload: any;
}

export interface ActionPayload extends Payload {
  payload: any;
}

export interface SubscribeOptions {
  prepend?: boolean
}

export type ActionSubscriber<P, S> = (action: P, state: S) => any;
export type ActionErrorSubscriber<P, S> = (action: P, state: S, error: Error) => any;

export interface ActionSubscribersObject<P, S> {
  before?: ActionSubscriber<P, S>;
  after?: ActionSubscriber<P, S>;
  error?: ActionErrorSubscriber<P, S>;
}

export type SubscribeActionOptions<P, S> = ActionSubscriber<P, S> | ActionSubscribersObject<P, S>;

export interface DispatchOptions {
  root?: boolean;
}

export interface CommitOptions {
  silent?: boolean;
  root?: boolean;
}

export interface StoreOptions<
S,
G extends GetterTree<S, S, G, G>,
A extends ActionTree<S, S, G, A, M, Modules>,
M extends MutationTree<S>,
Modules extends ModuleTree<S, S, G, A, M, Modules>
>  {
  state?: S | (() => S);
  getters?: G;
  actions?: A;
  mutations?: M;
  modules?: Modules;
  plugins?: Plugin<S, G, A, M, Modules>[];
  strict?: boolean;
  devtools?: boolean;
}

export type ActionHandler<S, R, G extends GetterTree<any, any, any, any>, A extends ActionTree<any, any, any, any, any, any>, M extends MutationTree<any>, Modules extends ModuleTree<any, any, any, any, any, any>> = (this: Store<R, G, A, M, Modules>, injectee: ActionContext<S, R, A, M, Modules>, payload?: any) => any;
export interface ActionObject<S, R, G extends GetterTree<any, any, any, any>, A extends ActionTree<any, any, any, any, any, any>, M extends MutationTree<any>, Modules extends ModuleTree<any, any, any, any, any, any>> {
  root?: boolean;
  handler: ActionHandler<S, R, G, A, M, Modules>;
}

export type Getter<S, R, G, RG> = (state: S, getters: G, rootState: R, rootGetters: RG) => any;
export type Action<S, R, G extends GetterTree<any, any, any, any>, A extends ActionTree<any, any, any, any, any, any>, M extends MutationTree<any>, Modules extends ModuleTree<any, any, any, any, any, any>> = ActionHandler<S, R, G, A, M, Modules> | ActionObject<S, R, G, A, M, Modules>;
export type Mutation<S> = (state: S, payload?: any) => any;
export type Plugin<S, G extends GetterTree<any, any, any, any>, A extends ActionTree<any, any, any, any, any, any>, M extends MutationTree<any>, Modules extends ModuleTree<any, any, any, any, any, any>> = (store: Store<S, G, A, M, Modules>) => any;

export interface Module<S, R, G extends GetterTree<any, any, any, any>, A extends ActionTree<S, R, any, any, any, any>, M extends MutationTree<any>, Modules extends ModuleTree<any, any, any, any, any, any>> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: GetterTree<S, R, G, G>;
  actions?: ActionTree<S, R, G, A, M, Modules>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<S, R, G, A, M, Modules>;
}

export interface ModuleOptions {
  preserveState?: boolean;
}

export interface GetterTree<S, R, G extends GetterTree<any, any, any, any>, RG extends GetterTree<any, any, any, any>> {
  [key: string]: Getter<S, R, G, RG>;
}

export interface ActionTree<S, R, G extends GetterTree<any, any, any, any>, A extends ActionTree<any, any, any, any, any, any>, M extends MutationTree<any>, Modules extends ModuleTree<any, any, any, any, any, any>> {
  [key: string]: Action<S, R, G, A, M, Modules>;
}

export interface MutationTree<S> {
  [key: string]: Mutation<S>;
}

export interface ModuleTree<S, R, G extends GetterTree<any, any, any, any>, A extends ActionTree<S, R, any, any, any, any>, M extends MutationTree<any>, Modules extends ModuleTree<any, any, any, any, any, any>> {
  [key: string]: Module<S, R, G, A, M, Modules>;
}


type AllMutations<Mutations extends MutationTree<any>, Modules extends  ModuleTree<any, any, any, any, any, any>> = { 
  [K in keyof Mutations]: Mutations[K] 
} & {
  [K in keyof NamespacedModuleKeys<Modules, 'mutations'>]:  NamespacedModuleKeys<Modules, 'mutations'>[K] extends (...args: any) => any ?  NamespacedModuleKeys<Modules, 'mutations'>[K] : never
}

type AllMutationsWithParam<Mutations extends MutationTree<any>, Modules extends  ModuleTree<any, any, any, any, any, any>> = {
  [K in keyof AllMutations<Mutations, Modules> as Parameters<AllMutations<Mutations, Modules>[K]>[1] extends undefined ? never : K]: AllMutations<Mutations, Modules>[K]
}

type AllMutationsWithoutParam<Mutations extends MutationTree<any>, Modules extends  ModuleTree<any, any, any, any, any, any>> = {
  [K in keyof AllMutations<Mutations, Modules> as Parameters<AllMutations<Mutations, Modules>[K]>[1] extends undefined ? K : never]: AllMutations<Mutations, Modules>[K]
}

type AllActions<Actions extends ActionTree<any, any, any, any, any, any>, Modules extends  ModuleTree<any, any, any, any, any, any>> = { 
  [K in keyof Actions]: Actions[K] 
} & {
  [K in keyof NamespacedModuleKeys<Modules, 'actions'>]:  NamespacedModuleKeys<Modules, 'actions'>[K] extends (...args: any) => any ?  NamespacedModuleKeys<Modules, 'actions'>[K] : never
}

type AllActionsWithParam<Actions extends ActionTree<any, any, any, any, any, any>, Modules extends  ModuleTree<any, any, any, any, any, any>> = {
  [K in keyof AllActions<Actions, Modules> as Parameters<AllActions<Actions, Modules>[K]>[1] extends undefined ? never : K]: AllActions<Actions, Modules>[K]
}

type AllActionsWithoutParam<Actions extends ActionTree<any, any, any, any, any, any>, Modules extends  ModuleTree<any, any, any, any, any, any>> = {
  [K in keyof AllActions<Actions, Modules> as Parameters<AllActions<Actions, Modules>[K]>[1] extends undefined ? K : never]: AllActions<Actions, Modules>[K]
}

type AllGetters<Getters extends GetterTree<any, any, any, any>, Modules extends ModuleTree<any, any, any, any, any, any>> = { 
  readonly [K in keyof Getters]: ReturnType<Getters[K]> 
} & {
  readonly [K in keyof NamespacedModuleKeys<Modules, 'getters'>]: NamespacedModuleKeys<Modules, 'getters'>[K] extends (...args: any) => any ? ReturnType<NamespacedModuleKeys<Modules, 'getters'>[K]> : never
}

type AllStates<State extends any, Modules extends ModuleTree<any, any, any, any, any, any>> = State & {
  [K in keyof Modules]: Modules[K]['state'] extends (...args: any) => any ? ReturnType<Modules[K]['state']> : Modules[K]['state']
}

declare const _default: {
  Store: typeof Store;
  mapState: typeof mapState,
  mapMutations: typeof mapMutations,
  mapGetters: typeof mapGetters,
  mapActions: typeof mapActions,
  createNamespacedHelpers: typeof createNamespacedHelpers,
  createLogger: typeof createLogger
};
export default _default;
