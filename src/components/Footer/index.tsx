import Image from "next/image";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="overflow-hidden">
      <div className="py-5 xl:py-7.5 bg-gray-100">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0 flex flex-wrap items-center justify-between gap-5">
          <p className="text-gray-900 font-medium">&copy; {year} Load Cart. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <span className="font-medium">We Accept:</span>
            <Image src="/images/payment/payment-01.svg" alt="visa" width={66} height={22} />
            <Image src="/images/payment/payment-02.svg" alt="paypal" width={18} height={21} />
            <Image src="/images/payment/payment-03.svg" alt="mastercard" width={33} height={24} />
            <Image src="/images/payment/payment-04.svg" alt="apple pay" width={53} height={22} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


