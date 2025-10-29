import annikaLogo from "@/assets/annika-logo.svg";

const Header = () => {
  return (
    <header className="w-full py-8 px-4 sm:px-8">
      <div className="flex items-center justify-center">
        <img 
          src={annikaLogo} 
          alt="ANNIKA" 
          className="h-20 sm:h-24 md:h-28 w-auto"
        />
      </div>
    </header>
  );
};

export default Header;
