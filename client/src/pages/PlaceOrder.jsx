import React, {
  useContext,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  motion,
} from "framer-motion";

import {
  MapPin,
  Banknote,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
  LoaderCircle,
  ArrowLeft,
  PackageCheck,
  CheckCircle2,
  CreditCard,
  AlertCircle,
} from "lucide-react";

import Nav from "../components/Nav";

import razorpayLogo from "../assets/razorpay.png";

import {
  authDataContext,
} from "../context/Authcontext";

import {
  shopDataContext,
} from "../context/ShopContext";


// ============================================================
// PLACE ORDER
// ============================================================

function PlaceOrder() {

  const navigate =
    useNavigate();


  // ==========================================================
  // CONTEXT
  // ==========================================================

  const {
    serverUrl,
  } = useContext(
    authDataContext
  );


  const {
    cartItems,
    setCartItems,
    getCartAmount,
    products,
    currency = "₹",
    deliveryFee = 50,
  } = useContext(
    shopDataContext
  );


  // ==========================================================
  // RAZORPAY KEY
  // ==========================================================

  const razorpayKeyId =
    import.meta.env
      .VITE_RAZORPAY_KEY_ID;


  // ==========================================================
  // FORM DATA
  // ==========================================================

  const [
    formData,
    setFormData,
  ] = useState({

    firstName: "",

    lastName: "",

    email: "",

    phone: "",

    street: "",

    city: "",

    state: "",

    zipcode: "",

    country: "India",

  });


  // ==========================================================
  // PAYMENT METHOD
  // ==========================================================

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState(
    "COD"
  );


  // ==========================================================
  // LOADING
  // ==========================================================

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(
    false
  );


  // ==========================================================
  // ERROR
  // ==========================================================

  const [
    errorMessage,
    setErrorMessage,
  ] = useState(
    ""
  );


  // ==========================================================
  // SUCCESS
  // ==========================================================

  const [
    successMessage,
    setSuccessMessage,
  ] = useState(
    ""
  );


  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const onChangeHandler = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(

      (
        previousData
      ) => ({

        ...previousData,

        [name]:
          value,

      })

    );


    setErrorMessage(
      ""
    );

  };


  // ==========================================================
  // CREATE ORDER ITEMS
  // ==========================================================

  const orderItems =

    useMemo(

      () => {

        const items = [];


        Object.entries(

          cartItems || {}

        ).forEach(

          ([
            productId,
            productSizes,
          ]) => {

            const product =

              products?.find(

                (
                  item
                ) =>

                  item._id ===
                  productId

              );


            if (
              !product ||
              !productSizes
            ) {

              return;

            }


            Object.entries(

              productSizes

            ).forEach(

              ([
                size,
                quantity,
              ]) => {

                if (
                  Number(
                    quantity
                  ) <= 0
                ) {

                  return;

                }


                items.push({

                  productId:
                    product._id,

                  name:
                    product.name,

                  price:

                    Number(
                      product.price
                    ),

                  quantity:

                    Number(
                      quantity
                    ),

                  size:
                    size,

                  image:
                    product.image1,

                });

              }

            );

          }

        );


        return items;

      },

      [
        cartItems,
        products,
      ]

    );


  // ==========================================================
  // CART CALCULATIONS
  // ==========================================================

  const cartAmount =

    typeof getCartAmount ===
    "function"

      ? Number(
          getCartAmount()
        )

      : 0;


  const finalDeliveryFee =

    cartAmount > 0

      ? Number(
          deliveryFee
        )

      : 0;


  const totalAmount =

    cartAmount +

    finalDeliveryFee;


  // ==========================================================
  // ADDRESS DATA
  // ==========================================================

  const getAddressData = () => ({

    firstName:
      formData.firstName,

    lastName:
      formData.lastName,

    email:
      formData.email,

    phone:
      formData.phone,

    street:
      formData.street,

    city:
      formData.city,

    state:
      formData.state,

    zipcode:
      formData.zipcode,

    country:
      formData.country,

  });


  // ==========================================================
  // ORDER DATA
  // ==========================================================

  const getOrderData = () => ({

    items:
      orderItems,

    amount:
      totalAmount,

    address:
      getAddressData(),

  });


  // ==========================================================
  // ORDER SUCCESS
  // ==========================================================

  const handleOrderSuccess = (
    order,
    message
  ) => {

    if (
      order
    ) {

      sessionStorage.setItem(

        "latestOrder",

        JSON.stringify(
          order
        )

      );

    }


    setSuccessMessage(

      message ||

      "Order placed successfully!"

    );


    setCartItems(
      {}
    );


    setTimeout(

      () => {

        navigate(

          "/orders",

          {
            replace:
              true,
          }

        );

      },

      1500

    );

  };


  // ==========================================================
  // INITIALIZE RAZORPAY
  // ==========================================================

  const initPay = async (
    razorpayOrder
  ) => {

    if (
      !window.Razorpay
    ) {

      setErrorMessage(

        "Razorpay checkout could not load. Please refresh and try again."

      );


      setPlacingOrder(
        false
      );


      return;

    }


    if (
      !razorpayKeyId
    ) {

      setErrorMessage(

        "VITE_RAZORPAY_KEY_ID is missing from the frontend .env file."

      );


      setPlacingOrder(
        false
      );


      return;

    }


    const options = {

      key:
        razorpayKeyId,


      amount:
        razorpayOrder.amount,


      currency:

        razorpayOrder.currency ||

        "INR",


      name:
        "FurEver",


      description:
        "Order Payment",


      order_id:
        razorpayOrder.id,


      prefill: {

        name:

          `${formData.firstName} ${formData.lastName}`

            .trim(),


        email:
          formData.email,


        contact:
          formData.phone,

      },


      notes: {

        customer_name:

          `${formData.firstName} ${formData.lastName}`

            .trim(),

      },


      theme: {

        color:
          "#FF5C35",

      },


      handler: async (
        response
      ) => {

        try {

          setPlacingOrder(
            true
          );


          const verificationResult =

            await axios.post(

              `${serverUrl}/api/order/verifypayment`,

              {

                razorpay_order_id:

                  response
                    .razorpay_order_id,


                razorpay_payment_id:

                  response
                    .razorpay_payment_id,


                razorpay_signature:

                  response
                    .razorpay_signature,

              },

              {

                withCredentials:
                  true,

              }

            );


          if (
            verificationResult
              .data
              ?.success
          ) {

            handleOrderSuccess(

              verificationResult
                .data
                ?.order,

              verificationResult
                .data
                ?.message ||

              "Payment successful! Your order has been placed."

            );


            return;

          }


          setErrorMessage(

            verificationResult
              .data
              ?.message ||

            "Payment verification failed."

          );

        }

        catch (
          error
        ) {

          console.log(

            "Razorpay Verification Error:",

            error
              ?.response
              ?.data ||

            error
              ?.message

          );


          setErrorMessage(

            error
              ?.response
              ?.data
              ?.message ||

            "Payment was completed, but verification failed."

          );

        }

        finally {

          setPlacingOrder(
            false
          );

        }

      },


      modal: {

        ondismiss: () => {

          setPlacingOrder(
            false
          );

        },

      },

    };


    const rzp =

      new window.Razorpay(
        options
      );


    rzp.on(

      "payment.failed",

      (
        response
      ) => {

        console.log(

          "Razorpay Payment Failed:",

          response

        );


        setErrorMessage(

          response
            ?.error
            ?.description ||

          "Payment failed. Please try again."

        );


        setPlacingOrder(
          false
        );

      }

    );


    rzp.open();

  };


  // ==========================================================
  // PLACE ORDER
  // ==========================================================

  const onSubmitHandler = async (
    event
  ) => {

    event.preventDefault();


    if (
      orderItems.length === 0
    ) {

      setErrorMessage(

        "Your cart is empty. Please add products before placing an order."

      );

      return;

    }


    try {

      setPlacingOrder(
        true
      );


      setErrorMessage(
        ""
      );


      setSuccessMessage(
        ""
      );


      const orderData =

        getOrderData();


      // ======================================================
      // RAZORPAY
      // ======================================================

      if (
        paymentMethod ===
        "Razorpay"
      ) {

        if (
          !window.Razorpay
        ) {

          setErrorMessage(

            "Razorpay checkout is unavailable. Please refresh the page."

          );


          setPlacingOrder(
            false
          );


          return;

        }


        const result =

          await axios.post(

            `${serverUrl}/api/order/placeorderrazorpay`,

            orderData,

            {

              withCredentials:
                true,

            }

          );


        console.log(

          "Razorpay Order:",

          result.data

        );


        if (
          !result.data?.success
        ) {

          setErrorMessage(

            result.data?.message ||

            "Unable to initialize Razorpay."

          );


          setPlacingOrder(
            false
          );


          return;

        }


        const razorpayOrder =

          result.data
            ?.razorpayOrder ||

          result.data
            ?.paymentOrder ||

          result.data
            ?.order;


        if (
          !razorpayOrder?.id
        ) {

          setErrorMessage(

            "Invalid Razorpay order received from the server."

          );


          setPlacingOrder(
            false
          );


          return;

        }


        await initPay(
          razorpayOrder
        );


        return;

      }


      // ======================================================
      // CASH ON DELIVERY
      // ======================================================

      const result =

        await axios.post(

          `${serverUrl}/api/order/placeorder`,

          orderData,

          {

            withCredentials:
              true,

          }

        );


      if (
        result.data?.success
      ) {

        handleOrderSuccess(

          result.data?.order,

          result.data?.message ||

          "Order placed successfully!"

        );


        return;

      }


      setErrorMessage(

        result.data?.message ||

        "Unable to place your order."

      );

    }

    catch (
      error
    ) {

      console.log(

        "Place Order Error:",

        error
          ?.response
          ?.data ||

        error
          ?.message

      );


      setErrorMessage(

        error
          ?.response
          ?.data
          ?.message ||

        "Something went wrong while placing your order."

      );

    }

    finally {

      if (
        paymentMethod ===
        "COD"
      ) {

        setPlacingOrder(
          false
        );

      }

    }

  };


  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (
    orderItems.length === 0 &&
    !successMessage
  ) {

    return (

      <>

        <Nav />


        <main

          className="
            flex
            min-h-[calc(100vh-80px)]
            items-center
            justify-center
            bg-[#FFFBF7]
            px-4
            py-12
          "

        >

          <div

            className="
              w-full
              max-w-xl
              rounded-[2rem]
              border
              border-[#F0E4DA]
              bg-white
              p-8
              text-center
              shadow-xl
              sm:p-12
            "

          >

            <ShoppingBag

              size={55}

              className="
                mx-auto
                text-[#FF5C35]
              "

            />


            <h1

              className="
                mt-6
                text-3xl
                font-black
                text-[#202020]
              "

            >

              Your cart is empty

            </h1>


            <p

              className="
                mx-auto
                mt-3
                max-w-md
                text-sm
                leading-6
                text-[#82796F]
              "

            >

              Add some products to your cart before proceeding to checkout.

            </p>


            <button

              type="button"

              onClick={
                () => navigate(
                  "/collection"
                )
              }

              className="
                mt-7
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#FF5C35]
                px-6
                py-3
                font-bold
                text-white
                transition
                hover:bg-[#E94B27]
              "

            >

              Continue Shopping

              <ChevronRight
                size={18}
              />

            </button>

          </div>

        </main>

      </>

    );

  }


  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (

    <>

      <Nav />


      <main

        className="
          min-h-[calc(100vh-80px)]
          bg-[#FFFBF7]
          px-4
          py-8
          sm:px-6
          lg:px-10
          lg:py-12
        "

      >

        <div

          className="
            mx-auto
            w-full
            max-w-7xl
          "

        >

          {/* HEADER */}

          <div

            className="
              mb-8
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "

          >

            <div>

              <button

                type="button"

                onClick={
                  () => navigate(
                    -1
                  )
                }

                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#82796F]
                  transition
                  hover:text-[#FF5C35]
                "

              >

                <ArrowLeft
                  size={18}
                />

                Back

              </button>


              <h1

                className="
                  mt-4
                  text-3xl
                  font-black
                  text-[#202020]
                  sm:text-4xl
                "

              >

                Checkout

              </h1>


              <p

                className="
                  mt-2
                  text-sm
                  text-[#82796F]
                "

              >

                Complete your details and place your order securely.

              </p>

            </div>


            <div

              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-[#E9E0D7]
                bg-white
                px-5
                py-3
              "

            >

              <ShieldCheck

                size={22}

                className="
                  text-[#34A853]
                "

              />


              <div>

                <p

                  className="
                    text-xs
                    text-[#82796F]
                  "

                >

                  Secure checkout

                </p>


                <p

                  className="
                    text-sm
                    font-bold
                    text-[#202020]
                  "

                >

                  Protected payment

                </p>

              </div>

            </div>

          </div>


          {/* MESSAGES */}

          {

            errorMessage && (

              <div

                className="
                  mb-6
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  px-5
                  py-4
                  text-sm
                  font-semibold
                  text-red-600
                "

              >

                <AlertCircle
                  size={20}
                />

                {errorMessage}

              </div>

            )

          }


          {

            successMessage && (

              <div

                className="
                  mb-6
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-green-200
                  bg-green-50
                  px-5
                  py-4
                  text-sm
                  font-semibold
                  text-green-700
                "

              >

                <CheckCircle2
                  size={20}
                />

                {successMessage}

              </div>

            )

          }


          <form

            onSubmit={
              onSubmitHandler
            }

            className="
              grid
              grid-cols-1
              gap-8
              lg:grid-cols-[minmax(0,1fr)_420px]
            "

          >

            {/* LEFT */}

            <div

              className="
                space-y-7
              "

            >

              {/* DELIVERY DETAILS */}

              <section

                className="
                  rounded-[2rem]
                  border
                  border-[#EEE2D8]
                  bg-white
                  p-5
                  shadow-sm
                  sm:p-8
                "

              >

                <div

                  className="
                    mb-7
                    flex
                    items-center
                    gap-3
                  "

                >

                  <div

                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#FFF0E9]
                      text-[#FF5C35]
                    "

                  >

                    <MapPin
                      size={21}
                    />

                  </div>


                  <div>

                    <h2

                      className="
                        text-xl
                        font-black
                        text-[#202020]
                      "

                    >

                      Delivery Details

                    </h2>


                    <p

                      className="
                        mt-1
                        text-xs
                        text-[#82796F]
                      "

                    >

                      Enter the address where you want your order delivered.

                    </p>

                  </div>

                </div>


                <div

                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "

                >

                  <input

                    required

                    name="firstName"

                    value={
                      formData.firstName
                    }

                    onChange={
                      onChangeHandler
                    }

                    placeholder="First name"

                    className="
                      rounded-xl
                      border
                      border-[#E8DDD2]
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-[#FF5C35]
                      focus:ring-4
                      focus:ring-[#FF5C35]/10
                    "

                  />


                  <input

                    required

                    name="lastName"

                    value={
                      formData.lastName
                    }

                    onChange={
                      onChangeHandler
                    }

                    placeholder="Last name"

                    className="
                      rounded-xl
                      border
                      border-[#E8DDD2]
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-[#FF5C35]
                      focus:ring-4
                      focus:ring-[#FF5C35]/10
                    "

                  />


                  <input

                    required

                    type="email"

                    name="email"

                    value={
                      formData.email
                    }

                    onChange={
                      onChangeHandler
                    }

                    placeholder="Email address"

                    className="
                      rounded-xl
                      border
                      border-[#E8DDD2]
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-[#FF5C35]
                      focus:ring-4
                      focus:ring-[#FF5C35]/10
                    "

                  />


                  <input

                    required

                    type="tel"

                    name="phone"

                    value={
                      formData.phone
                    }

                    onChange={
                      onChangeHandler
                    }

                    placeholder="Phone number"

                    className="
                      rounded-xl
                      border
                      border-[#E8DDD2]
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-[#FF5C35]
                      focus:ring-4
                      focus:ring-[#FF5C35]/10
                    "

                  />


                  <input

                    required

                    name="street"

                    value={
                      formData.street
                    }

                    onChange={
                      onChangeHandler
                    }

                    placeholder="Street address"

                    className="
                      rounded-xl
                      border
                      border-[#E8DDD2]
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-[#FF5C35]
                      focus:ring-4
                      focus:ring-[#FF5C35]/10
                      sm:col-span-2
                    "

                  />


                  <input

                    required

                    name="city"

                    value={
                      formData.city
                    }

                    onChange={
                      onChangeHandler
                    }

                    placeholder="City"

                    className="
                      rounded-xl
                      border
                      border-[#E8DDD2]
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-[#FF5C35]
                      focus:ring-4
                      focus:ring-[#FF5C35]/10
                    "

                  />


                  <input

                    required

                    name="state"

                    value={
                      formData.state
                    }

                    onChange={
                      onChangeHandler
                    }

                    placeholder="State"

                    className="
                      rounded-xl
                      border
                      border-[#E8DDD2]
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-[#FF5C35]
                      focus:ring-4
                      focus:ring-[#FF5C35]/10
                    "

                  />


                  <input

                    required

                    name="zipcode"

                    value={
                      formData.zipcode
                    }

                    onChange={
                      onChangeHandler
                    }

                    placeholder="PIN code"

                    className="
                      rounded-xl
                      border
                      border-[#E8DDD2]
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-[#FF5C35]
                      focus:ring-4
                      focus:ring-[#FF5C35]/10
                    "

                  />


                  <input

                    required

                    name="country"

                    value={
                      formData.country
                    }

                    onChange={
                      onChangeHandler
                    }

                    placeholder="Country"

                    className="
                      rounded-xl
                      border
                      border-[#E8DDD2]
                      px-4
                      py-3.5
                      text-sm
                      outline-none
                      transition
                      focus:border-[#FF5C35]
                      focus:ring-4
                      focus:ring-[#FF5C35]/10
                    "

                  />

                </div>

              </section>


              {/* PAYMENT */}

              <section

                className="
                  rounded-[2rem]
                  border
                  border-[#EEE2D8]
                  bg-white
                  p-5
                  shadow-sm
                  sm:p-8
                "

              >

                <div

                  className="
                    mb-6
                    flex
                    items-center
                    gap-3
                  "

                >

                  <div

                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#FFF0E9]
                      text-[#FF5C35]
                    "

                  >

                    <CreditCard
                      size={21}
                    />

                  </div>


                  <div>

                    <h2

                      className="
                        text-xl
                        font-black
                        text-[#202020]
                      "

                    >

                      Payment Method

                    </h2>


                    <p

                      className="
                        mt-1
                        text-xs
                        text-[#82796F]
                      "

                    >

                      Choose your preferred payment method.

                    </p>

                  </div>

                </div>


                <div

                  className="
                    space-y-4
                  "

                >

                  {/* COD */}

                  <button

                    type="button"

                    onClick={
                      () => setPaymentMethod(
                        "COD"
                      )
                    }

                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-2xl
                      border-2
                      p-4
                      text-left
                      transition

                      ${
                        paymentMethod ===
                        "COD"

                          ? "border-[#FF5C35] bg-[#FFF5F0]"

                          : "border-[#EEE2D8] bg-white"
                      }
                    `}

                  >

                    <div

                      className="
                        flex
                        items-center
                        gap-4
                      "

                    >

                      <div

                        className="
                          flex
                          h-11
                          w-11
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#FFF0E9]
                          text-[#FF5C35]
                        "

                      >

                        <Banknote
                          size={22}
                        />

                      </div>


                      <div>

                        <p

                          className="
                            font-bold
                            text-[#202020]
                          "

                        >

                          Cash on Delivery

                        </p>


                        <p

                          className="
                            mt-1
                            text-xs
                            text-[#82796F]
                          "

                        >

                          Pay when your order arrives.

                        </p>

                      </div>

                    </div>


                    {

                      paymentMethod ===
                      "COD" && (

                        <CheckCircle2

                          size={22}

                          className="
                            text-[#FF5C35]
                          "

                        />

                      )

                    }

                  </button>


                  {/* RAZORPAY */}

                  <button

                    type="button"

                    onClick={
                      () => setPaymentMethod(
                        "Razorpay"
                      )
                    }

                    className={`
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-2xl
                      border-2
                      p-4
                      text-left
                      transition

                      ${
                        paymentMethod ===
                        "Razorpay"

                          ? "border-[#FF5C35] bg-[#FFF5F0]"

                          : "border-[#EEE2D8] bg-white"
                      }
                    `}

                  >

                    <div

                      className="
                        flex
                        items-center
                        gap-4
                      "

                    >

                      <img

                        src={
                          razorpayLogo
                        }

                        alt="Razorpay"

                        className="
                          h-11
                          w-11
                          rounded-xl
                          object-contain
                        "

                      />


                      <div>

                        <p

                          className="
                            font-bold
                            text-[#202020]
                          "

                        >

                          Razorpay

                        </p>


                        <p

                          className="
                            mt-1
                            text-xs
                            text-[#82796F]
                          "

                        >

                          Pay securely using UPI, cards or net banking.

                        </p>

                      </div>

                    </div>


                    {

                      paymentMethod ===
                      "Razorpay" && (

                        <CheckCircle2

                          size={22}

                          className="
                            text-[#FF5C35]
                          "

                        />

                      )

                    }

                  </button>

                </div>

              </section>

            </div>


            {/* RIGHT ORDER SUMMARY */}

            <aside

              className="
                h-fit
                rounded-[2rem]
                border
                border-[#EEE2D8]
                bg-white
                p-5
                shadow-sm
                lg:sticky
                lg:top-6
                sm:p-7
              "

            >

              <div

                className="
                  flex
                  items-center
                  gap-3
                "

              >

                <div

                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#FFF0E9]
                    text-[#FF5C35]
                  "

                >

                  <ShoppingBag
                    size={21}
                  />

                </div>


                <div>

                  <h2

                    className="
                      text-xl
                      font-black
                      text-[#202020]
                    "

                  >

                    Order Summary

                  </h2>


                  <p

                    className="
                      mt-1
                      text-xs
                      text-[#82796F]
                    "

                  >

                    {orderItems.length} item
                    {orderItems.length !== 1
                      ? "s"
                      : ""
                    }

                  </p>

                </div>

              </div>


              <div

                className="
                  mt-6
                  max-h-[350px]
                  space-y-4
                  overflow-y-auto
                  pr-1
                "

              >

                {

                  orderItems.map(

                    (
                      item,
                      index
                    ) => (

                      <div

                        key={`
                          ${item.productId}
                          -
                          ${item.size}
                          -
                          ${index}
                        `}

                        className="
                          flex
                          gap-4
                        "

                      >

                        <img

                          src={
                            item.image
                          }

                          alt={
                            item.name
                          }

                          className="
                            h-20
                            w-16
                            rounded-xl
                            border
                            border-[#F0E6DD]
                            object-cover
                          "

                        />


                        <div

                          className="
                            min-w-0
                            flex-1
                          "

                        >

                          <p

                            className="
                              truncate
                              text-sm
                              font-bold
                              text-[#202020]
                            "

                          >

                            {item.name}

                          </p>


                          <p

                            className="
                              mt-1
                              text-xs
                              text-[#82796F]
                            "

                          >

                            Size: {item.size}

                            {" · "}

                            Qty: {item.quantity}

                          </p>


                          <p

                            className="
                              mt-2
                              text-sm
                              font-black
                              text-[#FF5C35]
                            "

                          >

                            {

                              currency

                            }

                            {

                              (
                                item.price *
                                item.quantity
                              ).toLocaleString(
                                "en-IN"
                              )

                            }

                          </p>

                        </div>

                      </div>

                    )

                  )

                }

              </div>


              <div

                className="
                  mt-7
                  space-y-4
                  border-t
                  border-[#EEE2D8]
                  pt-6
                "

              >

                <div

                  className="
                    flex
                    items-center
                    justify-between
                    text-sm
                    text-[#82796F]
                  "

                >

                  <span>
                    Subtotal
                  </span>


                  <span

                    className="
                      font-bold
                      text-[#202020]
                    "

                  >

                    {currency}

                    {

                      cartAmount.toLocaleString(
                        "en-IN"
                      )

                    }

                  </span>

                </div>


                <div

                  className="
                    flex
                    items-center
                    justify-between
                    text-sm
                    text-[#82796F]
                  "

                >

                  <span>
                    Delivery
                  </span>


                  <span

                    className="
                      font-bold
                      text-[#202020]
                    "

                  >

                    {currency}

                    {

                      finalDeliveryFee.toLocaleString(
                        "en-IN"
                      )

                    }

                  </span>

                </div>


                <div

                  className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-dashed
                    border-[#E6D9CE]
                    pt-5
                  "

                >

                  <span

                    className="
                      text-base
                      font-black
                      text-[#202020]
                    "

                  >

                    Total

                  </span>


                  <span

                    className="
                      text-2xl
                      font-black
                      text-[#FF5C35]
                    "

                  >

                    {currency}

                    {

                      totalAmount.toLocaleString(
                        "en-IN"
                      )

                    }

                  </span>

                </div>

              </div>


              <motion.button

                type="submit"

                disabled={
                  placingOrder
                }

                whileTap={{
                  scale:
                    0.98,
                }}

                className="
                  mt-7
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  bg-[#FF5C35]
                  px-6
                  py-4
                  font-bold
                  text-white
                  shadow-lg
                  transition
                  hover:bg-[#E94B27]
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                "

              >

                {

                  placingOrder

                    ? (

                      <>

                        <LoaderCircle

                          size={21}

                          className="
                            animate-spin
                          "

                        />


                        {

                          paymentMethod ===
                          "Razorpay"

                            ? "Opening secure payment..."

                            : "Placing Order..."

                        }

                      </>

                    )

                    : (

                      <>

                        <PackageCheck
                          size={21}
                        />


                        {

                          paymentMethod ===
                          "Razorpay"

                            ? "PAY WITH RAZORPAY"

                            : "PLACE ORDER"

                        }


                        <ChevronRight
                          size={20}
                        />

                      </>

                    )

                }

              </motion.button>


              <div

                className="
                  mt-5
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-center
                  text-xs
                  text-[#82796F]
                "

              >

                <ShieldCheck

                  size={16}

                  className="
                    text-[#34A853]
                  "

                />

                Your payment information is secure.

              </div>

            </aside>

          </form>

        </div>

      </main>

    </>

  );

}


export default PlaceOrder;