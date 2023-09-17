import { clsx } from "clsx";

const Modal = ({ children, className }: any) => {
  return (
    <div
      className={clsx(
        "absolute w-1/2 max-w-xs h-fit left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Modal;
