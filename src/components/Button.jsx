import Link from "next/link";

const Button = ({ text, href, className }) => {
  const Comp = href ? Link : "button";
  return (
    <Comp
      className={`bg-primary-regular hover:bg-[#f33d06] text-white font-medium py-2 px-6 rounded-full duration-500 cursor-pointer ${className}`}
      href={href}>
      {text}
    </Comp>
  );
};

export default Button;
