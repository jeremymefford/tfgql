export interface DomainMapper<TInput, TOutput> {
  map(input: TInput): TOutput;
}
