import { CartPreview } from "./cart-preview";

const CheckoutPage = () => {
  return (
    <div className="w-full grid grid-cols-2 p-8">
      <CartPreview />
      <div className="grid place-items-center">Formulario de pago</div>
    </div>
  );
};

export default CheckoutPage;
