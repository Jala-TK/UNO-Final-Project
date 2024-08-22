export type ButtonProps = {
  onClick?: () => void;
  disabledLoading: boolean;
  className?: string;
  label?: string;
  type?: string['button' | 'submit' | 'reset' | undefined] | undefined;
};
