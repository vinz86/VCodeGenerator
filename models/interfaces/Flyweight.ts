export interface Flyweight<T> {
  configure(options: T): void;
  render(): string;
}