export type Keys =
  | "start"
  | "overview"
  | "expenses"
  | "realtime-updates"
  | "setup"
  | "savings"
  | "getStarted";

export type SlideProps = {
  scrollToIndex: (index: Keys) => void;
};
