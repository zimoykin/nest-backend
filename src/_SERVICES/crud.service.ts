export interface Crud<T> {
  ///service: Service<T>

  read: (id: string) => Promise<T>
  readAll: (query: any) => Promise<T[]>
  create: (input: any, req: Request) => Promise<T>
  delete: (id: string) => Promise<string>
  patch: (id: string, input: any) => Promise<T>
}
