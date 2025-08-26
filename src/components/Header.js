import Image from "next/image";
import AnimatedValue from "@/components/AnimatedValue";

function Header() {
  const currentDate = new Date();

  // Format date as "Thu, May 29, 2025"
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
    hour12: true,
  });

  return (
    <div>
      <nav className="navbar p-2 bg-white shadow-sm rounded-sm text-primary px-2 md:px-4">
        <div className="navbar-start">
          <Image
            src="/daystar_logo.png"
            priority={false}
            alt="Logo"
            width={80}
            height={50}
          />
        </div>
        <div className="navbar-center hidden lg:flex"></div>
        <div className="navbar-end">
          <div className="flex items-end flex-row flex-wrap font-bold gap-2">
            <div className="text-sm md:text-md flex gap-4 items-center">
              <div className="relative inline-block">{formattedDate}</div>
              <div className="relative inline-block">
                {/* <AnimatedValue value={formattedTime} className="relative z-10"> */}
                {formattedTime}
                {/* </AnimatedValue> */}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
