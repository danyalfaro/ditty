import { FaUser } from "react-icons/fa";

export default function TopBar({ children }: any) {
  return (
    <>
      <div className="flex justify-center items-center h-12 w-full">
        <div className="flex justify-between items-center h-full w-1/2">
          <h1>DITTY</h1>
          <FaUser size={"24px"} />
        </div>
      </div>
    </>
  );
}
