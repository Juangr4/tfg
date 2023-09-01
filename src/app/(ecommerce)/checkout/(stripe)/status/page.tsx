import { type FC } from "react";
import StripeProvider from "../_stripe/provider";
import { PaymentDetails } from "./status";

interface CheckoutStatusPageProps {
  searchParams: {
    payment_intent_client_secret?: string;
    payment_intent?: string;
    redirect_status?: string;
    clear?: string;
  };
}

const CheckoutStatusPage: FC<CheckoutStatusPageProps> = async ({
  searchParams,
}) => {
  if (!searchParams.payment_intent) {
    return <div>Oups</div>;
  }

  return (
    <StripeProvider>
      <PaymentDetails
        paymentIntentId={searchParams.payment_intent}
        paymentIntentSecret={searchParams.payment_intent_client_secret}
        clear={searchParams.clear}
      />
    </StripeProvider>
  );
};

export default CheckoutStatusPage;
