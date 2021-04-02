export interface Crud<T> {
  read: (id: string) => Promise<T>
  readAll: (query: any) => Promise<T[]>
  create: (input: T, req: Request) => Promise<T>
  delete: (id: string) => Promise<string>
  patch: (id: string, input: T) => Promise<T>
}
