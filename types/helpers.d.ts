import { ComponentPublicInstance } from 'vue';
import { Dispatch, Commit, ModuleTree, ActionTree, GetterTree, MutationTree } from './index';

type Computed = () => any;
type InlineComputed<T extends Function> = T extends (...args: any[]) => infer R ? () => R : never
type MutationMethod = (...args: any[]) => void;
type ActionMethod = (...args: any[]) => Promise<any>;
type InlineMethod<T extends (fn: any, ...args: any[]) => any> = T extends (fn: any, ...args: infer Args) => infer R ? (...args: Args) => R : never
type CustomVue = ComponentPublicInstance & Record<string, any>;

interface Mapper<R> {
  <Key extends string>(map: Key[]): { [K in Key]: R };
  <Map extends Record<string, string>>(map: Map): { [K in keyof Map]: R };
}

interface MapperWithNamespace<R> {
  <Key extends string>(namespace: string, map: Key[]): { [K in Key]: R };
  <Map extends Record<string, string>>(namespace: string, map: Map): { [K in keyof Map]: R };
}

interface MapperForState {
  <S, Map extends Record<string, (this: CustomVue, state: S, getters: any) => any> = {}>(
    map: Map
  ): { [K in keyof Map]: InlineComputed<Map[K]> };
}

interface MapperForStateWithNamespace {
  <S, Map extends Record<string, (this: CustomVue, state: S, getters: any) => any> = {}>(
    namespace: string,
    map: Map
  ): { [K in keyof Map]: InlineComputed<Map[K]> };
}

interface MapperForAction {
  <Map extends Record<string, (this: CustomVue, dispatch: Dispatch<any, any>, ...args: any[]) => any>>(
    map: Map
  ): { [K in keyof Map]: InlineMethod<Map[K]> };
}

interface MapperForActionWithNamespace {
  <Map extends Record<string, (this: CustomVue, dispatch: Dispatch<any, any>, ...args: any[]) => any>>(
    namespace: string,
    map: Map
  ): { [K in keyof Map]: InlineMethod<Map[K]> };
}

interface MapperForMutation {
  <Map extends Record<string, (this: CustomVue, commit: Commit<any, any>, ...args: any[]) => any>>(
    map: Map
  ): { [K in keyof Map]: InlineMethod<Map[K]> };
}

interface MapperForMutationWithNamespace {
  <Map extends Record<string, (this: CustomVue, commit: Commit<any, any>, ...args: any[]) => any>>(
    namespace: string,
    map: Map
  ): { [K in keyof Map]: InlineMethod<Map[K]> };
}


interface NamespacedMappers {
  mapState: Mapper<Computed> & MapperForState;
  mapMutations: Mapper<MutationMethod> & MapperForMutation;
  mapGetters: Mapper<Computed>;
  mapActions: Mapper<ActionMethod> & MapperForAction;
}

export declare const mapState: Mapper<Computed>
  & MapperWithNamespace<Computed>
  & MapperForState
  & MapperForStateWithNamespace;

export declare const mapMutations: Mapper<MutationMethod>
  & MapperWithNamespace<MutationMethod>
  & MapperForMutation
  & MapperForMutationWithNamespace;

export declare const mapGetters: Mapper<Computed>
  & MapperWithNamespace<Computed>;

export declare const mapActions: Mapper<ActionMethod>
  & MapperWithNamespace<ActionMethod>
  & MapperForAction
  & MapperForActionWithNamespace;

export declare function createNamespacedHelpers(namespace: string): NamespacedMappers;


type ObjKeyof<T> = T extends object ? keyof T : never
type KeyofKeyof<T> = ObjKeyof<T> | { [K in keyof T]: ObjKeyof<T[K]> }[keyof T]
type StripNever<T> = Pick<T, { [K in keyof T]: [T[K]] extends [never] ? never : K }[keyof T]>;
type Lookup<T, K> = T extends any ? K extends keyof T ? T[K] : never : never
type Flatten<T> = T extends object ? StripNever<{
  [K in KeyofKeyof<T>]: Exclude<K extends keyof T ? T[K] : never, object> | { [P in keyof T]: Lookup<T[P], K> }[keyof T]
}> : T
type Namespaced<Value extends string | number | symbol, Namespace extends string | number | symbol = ''> = Namespace extends '' ? Value : (Namespace extends string ? Value extends string ? `${Namespace}/${Value}` : '' : '')

export type EmptyObject<T extends unknown = unknown> = Record<string, T>;
export type NamespacedModuleKeys<Modules extends ModuleTree<any, any, any, any, any, any>, Key extends 'actions'|'mutations'|'getters', BaseNamespace extends string = ''> =  Flatten<{
  [K in Extract<keyof Modules, string>]: {
    [L in keyof Modules[K][Key] as Namespaced<L, Modules[K]['namespaced'] extends true ? Namespaced<K, BaseNamespace> : BaseNamespace>]: Modules[K][Key][L] 
  } & (Modules[K]['modules'] extends infer R ? R extends ModuleTree<any, any, any, any, any, any> ? NamespacedModuleKeys<R, Key, BaseNamespace extends '' ? K : `${BaseNamespace}/${K}`> : never : never);
}>
