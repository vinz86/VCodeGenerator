export interface IFlyweightComponent<T> {
  options?: T;
  configure(options: T): void;
  render(): string;
}