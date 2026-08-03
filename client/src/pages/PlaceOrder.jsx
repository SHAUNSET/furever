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
} from "lucide-react";

import Nav from "../components/Nav";

import razorpayLogo from "../assets/razorpay.png";

import {
  authDataContext,
} from "../context/Authcontext";

import {
  shopDataContext,
} from "../context/ShopContext";


function PlaceOrder() {

  const navigate =
    useNavigate();


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


  // ==========================================
  // FORM DATA
  // ==========================================

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


  // ==========================================
  // PAYMENT METHOD
  // ==========================================

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState(
    "COD"
  );


  // ==========================================
  // LOADING
  // ==========================================

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(
    false
  );


  // ==========================================
  // ERROR
  // ==========================================

  const [
    errorMessage,
    setErrorMessage,
  ] = useState(
    ""
  );


  // ==========================================
  // SUCCESS MESSAGE
  // ==========================================

  const [
    successMessage,
    setSuccessMessage,
  ] = useState(
    ""
  );


  // ==========================================
  // ON CHANGE HANDLER
  // ==========================================

  const onChangeHandler = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData(
      (previousData) => ({

        ...previousData,

        [name]: value,

      })
    );


    setErrorMessage(
      ""
    );

  };


  // ==========================================
  // CREATE ORDER ITEMS
  // ==========================================

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

                (item) =>

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


  // ==========================================
  // CART CALCULATIONS
  // ==========================================

  const cartAmount =

    typeof getCartAmount ===
    "function"

      ?

      Number(
        getCartAmount()
      )

      :

      0;


  const finalDeliveryFee =

    cartAmount > 0

      ?

      Number(
        deliveryFee
      )

      :

      0;


  const totalAmount =

    cartAmount +

    finalDeliveryFee;


  // ==========================================
  // PLACE ORDER
  // ==========================================

  const onSubmitHandler =
    async (
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


      if (
        paymentMethod ===
        "Razorpay"
      ) {

        setErrorMessage(

          "Razorpay payment is not connected yet. Please select Cash on Delivery."

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


        // ======================================
        // ADDRESS
        // ======================================

        const address = {

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

        };


        // ======================================
        // ORDER DATA
        // ======================================

        const orderData = {

          items:
            orderItems,

          amount:
            totalAmount,

          address:
            address,

        };


        // ======================================
        // API REQUEST
        // ======================================

        const result =

          await axios.post(

            `${serverUrl}/api/order/placeorder`,

            orderData,

            {

              withCredentials:
                true,

            }

          );


        console.log(

          "Place Order Result:",

          result.data

        );


        // ======================================
        // SUCCESS
        // ======================================

        if (
          result.data.success
        ) {

          // Store the newly created order
          // because the backend currently
          // has no GET orders endpoint.

          sessionStorage.setItem(

            "latestOrder",

            JSON.stringify(
              result.data.order
            )

          );


          setSuccessMessage(

            result.data.message ||

            "Order placed successfully!"

          );


          // Clear frontend cart

          setCartItems(
            {}
          );


          // Redirect after showing
          // the success message.

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


          return;

        }


        setErrorMessage(

          result.data.message ||

          "Unable to place your order."

        );


      } catch (
        error
      ) {

        console.log(

          "Place Order Error:",

          error.response?.data ||

          error.message

        );


        setErrorMessage(

          error.response?.data?.message ||

          "Something went wrong while placing your order."

        );


      } finally {

        setPlacingOrder(
          false
        );

      }

    };


  // ==========================================
  // EMPTY CART
  // ==========================================

  if (
    orderItems.length === 0 &&
    !successMessage
  ) {

    return (

      <>

        <Nav />


        <main

          className="

            min-h-[calc(100vh-80px)]

            bg-[#FFFBF7]

            flex

            items-center

            justify-center

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

              border-[#F0E2D7]

              bg-white

              px-6

              py-12

              text-center

              shadow-xl

              sm:px-12

            "

          >

            <div

              className="

                mx-auto

                mb-6

                flex

                h-20

                w-20

                items-center

                justify-center

                rounded-full

                bg-[#FFF1EA]

                text-[#FF5C35]

              "

            >

              <ShoppingBag
                size={36}
              />

            </div>


            <h1

              className="

                text-4xl

                font-bold

                text-[#181D27]

              "

            >

              Your cart is empty

            </h1>


            <p

              className="

                mt-3

                text-[#82796F]

              "

            >

              Add products to your cart before proceeding to checkout.

            </p>


            <button

              onClick={() =>

                navigate(
                  "/collections"
                )

              }

              className="

                mt-8

                rounded-full

                bg-[#FF5C35]

                px-7

                py-3.5

                font-semibold

                text-white

                transition

                hover:bg-[#E94B27]

              "

            >

              Continue Shopping

            </button>

          </div>

        </main>

      </>

    );

  }


  // ==========================================
  // SUCCESS SCREEN
  // ==========================================

  if (
    successMessage
  ) {

    return (

      <>

        <Nav />


        <main

          className="

            min-h-[calc(100vh-80px)]

            bg-[#FFFBF7]

            flex

            items-center

            justify-center

            px-4

            py-12

          "

        >

          <motion.div

            initial={{

              opacity: 0,

              y: 25,

            }}

            animate={{

              opacity: 1,

              y: 0,

            }}

            className="

              w-full

              max-w-xl

              rounded-[2rem]

              border

              border-[#F0E2D7]

              bg-white

              px-6

              py-12

              text-center

              shadow-xl

              sm:px-12

            "

          >

            <div

              className="

                mx-auto

                mb-6

                flex

                h-24

                w-24

                items-center

                justify-center

                rounded-full

                bg-green-50

                text-green-600

              "

            >

              <CheckCircle2
                size={50}
              />

            </div>


            <h1

              className="

                text-4xl

                font-bold

                text-[#181D27]

              "

            >

              Order Placed Successfully!

            </h1>


            <p

              className="

                mt-4

                text-[#82796F]

              "

            >

              Your order has been received.
              Redirecting you to your order details...

            </p>


            <LoaderCircle

              size={26}

              className="

                mx-auto

                mt-7

                animate-spin

                text-[#FF5C35]

              "

            />

          </motion.div>

        </main>

      </>

    );

  }


  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (

    <>

      <Nav />


      <main

        className="

          min-h-screen

          bg-[#FFFBF7]

          px-4

          py-8

          sm:px-6

          lg:px-10

          xl:px-16

          2xl:px-24

        "

      >

        <div

          className="

            mx-auto

            mb-8

            w-full

            max-w-[1600px]

          "

        >

          <button

            type="button"

            onClick={() =>

              navigate(
                "/cart"
              )

            }

            className="

              mb-4

              flex

              items-center

              gap-2

              text-sm

              font-semibold

              text-[#82796F]

              hover:text-[#FF5C35]

            "

          >

            <ArrowLeft
              size={18}
            />

            Back to Cart

          </button>


          <h1

            className="

              text-4xl

              font-bold

              text-[#181D27]

              sm:text-5xl

            "

          >

            Complete your

            <span

              className="

                ml-2

                text-[#FF5C35]

              "

            >

              order

            </span>

          </h1>


          <p

            className="

              mt-2

              text-[#82796F]

              sm:text-lg

            "

          >

            Enter your delivery information and review your order.

          </p>

        </div>


        <form

          onSubmit={
            onSubmitHandler
          }

          className="

            mx-auto

            grid

            w-full

            max-w-[1600px]

            grid-cols-1

            gap-8

            xl:grid-cols-[minmax(0,1.45fr)_minmax(380px,0.75fr)]

            xl:items-start

          "

        >

          {/* DELIVERY INFORMATION */}

          <section

            className="

              overflow-hidden

              rounded-[2rem]

              border

              border-[#F0E2D7]

              bg-white

              shadow-xl

            "

          >

            <div

              className="

                border-b

                border-[#F0E2D7]

                bg-[#FFF8F1]

                px-6

                py-6

                sm:px-8

              "

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

                    h-12

                    w-12

                    items-center

                    justify-center

                    rounded-2xl

                    bg-[#FF5C35]

                    text-white

                  "

                >

                  <MapPin
                    size={23}
                  />

                </div>


                <div>

                  <h2

                    className="

                      text-3xl

                      font-bold

                      text-[#181D27]

                    "

                  >

                    Delivery Information

                  </h2>


                  <p

                    className="

                      mt-1

                      text-sm

                      text-[#82796F]

                    "

                  >

                    Where should we deliver your order?

                  </p>

                </div>

              </div>

            </div>


            <div

              className="

                grid

                grid-cols-1

                gap-5

                p-6

                sm:grid-cols-2

                sm:p-8

              "

            >

              {[
                {
                  label: "First Name",
                  name: "firstName",
                  type: "text",
                  placeholder: "Shaunak",
                },

                {
                  label: "Last Name",
                  name: "lastName",
                  type: "text",
                  placeholder: "Naik",
                },

                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  placeholder: "you@email.com",
                },

                {
                  label: "Phone Number",
                  name: "phone",
                  type: "tel",
                  placeholder: "9876543210",
                },

              ].map(

                (field) => (

                  <div
                    key={field.name}
                  >

                    <label

                      className="

                        font-semibold

                        text-[#3A342F]

                      "

                    >

                      {field.label}

                    </label>


                    <input

                      required

                      type={
                        field.type
                      }

                      name={
                        field.name
                      }

                      value={
                        formData[
                          field.name
                        ]
                      }

                      onChange={
                        onChangeHandler
                      }

                      placeholder={
                        field.placeholder
                      }

                      className="

                        mt-2

                        w-full

                        rounded-xl

                        border

                        border-[#E8DDD3]

                        px-4

                        py-3

                        outline-none

                        transition

                        focus:border-[#FF5C35]

                        focus:ring-2

                        focus:ring-[#FF5C35]/10

                      "

                    />

                  </div>

                )

              )}


              <div

                className="

                  sm:col-span-2

                "

              >

                <label

                  className="

                    font-semibold

                    text-[#3A342F]

                  "

                >

                  Street Address

                </label>


                <input

                  required

                  type="text"

                  name="street"

                  value={
                    formData.street
                  }

                  onChange={
                    onChangeHandler
                  }

                  placeholder="House number, building, street"

                  className="

                    mt-2

                    w-full

                    rounded-xl

                    border

                    border-[#E8DDD3]

                    px-4

                    py-3

                    outline-none

                    transition

                    focus:border-[#FF5C35]

                  "

                />

              </div>


              {[
                {
                  label: "City",
                  name: "city",
                  placeholder: "Pune",
                },

                {
                  label: "State",
                  name: "state",
                  placeholder: "Maharashtra",
                },

                {
                  label: "PIN Code",
                  name: "zipcode",
                  placeholder: "411001",
                },

                {
                  label: "Country",
                  name: "country",
                  placeholder: "India",
                },

              ].map(

                (field) => (

                  <div
                    key={field.name}
                  >

                    <label

                      className="

                        font-semibold

                        text-[#3A342F]

                      "

                    >

                      {field.label}

                    </label>


                    <input

                      required

                      type="text"

                      name={
                        field.name
                      }

                      value={
                        formData[
                          field.name
                        ]
                      }

                      onChange={
                        onChangeHandler
                      }

                      placeholder={
                        field.placeholder
                      }

                      className="

                        mt-2

                        w-full

                        rounded-xl

                        border

                        border-[#E8DDD3]

                        px-4

                        py-3

                        outline-none

                        transition

                        focus:border-[#FF5C35]

                      "

                    />

                  </div>

                )

              )}

            </div>

          </section>


          {/* RIGHT SIDE */}

          <aside

            className="

              space-y-6

              xl:sticky

              xl:top-28

            "

          >

            {/* CART TOTAL */}

            <section

              className="

                rounded-[2rem]

                border

                border-[#F0E2D7]

                bg-white

                p-6

                shadow-xl

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

                    rounded-xl

                    bg-[#FFF1EA]

                    text-[#FF5C35]

                  "

                >

                  <ShoppingBag
                    size={22}
                  />

                </div>


                <div>

                  <h2

                    className="

                      text-2xl

                      font-bold

                      text-[#181D27]

                    "

                  >

                    Cart Totals

                  </h2>


                  <p

                    className="

                      text-sm

                      text-[#82796F]

                    "

                  >

                    {orderItems.length}

                    {" "}

                    item

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

                  max-h-[280px]

                  space-y-4

                  overflow-y-auto

                "

              >

                {orderItems.map(

                  (
                    item,
                    index
                  ) => (

                    <div

                      key={`${item.productId}-${item.size}-${index}`}

                      className="

                        flex

                        gap-3

                        border-b

                        border-[#F4EAE3]

                        pb-4

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

                          h-16

                          w-14

                          rounded-xl

                          bg-[#FFF8F1]

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

                            font-semibold

                            text-[#181D27]

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

                      </div>


                      <p

                        className="

                          whitespace-nowrap

                          font-bold

                          text-[#181D27]

                        "

                      >

                        {currency}

                        {item.price *
                          item.quantity}

                      </p>

                    </div>

                  )

                )}

              </div>


              <div

                className="

                  mt-5

                  space-y-3

                  text-sm

                "

              >

                <div

                  className="

                    flex

                    justify-between

                    text-[#82796F]

                  "

                >

                  <span>
                    Subtotal
                  </span>

                  <span>

                    {currency}

                    {cartAmount}

                  </span>

                </div>


                <div

                  className="

                    flex

                    justify-between

                    text-[#82796F]

                  "

                >

                  <span>
                    Delivery
                  </span>

                  <span>

                    {currency}

                    {finalDeliveryFee}

                  </span>

                </div>


                <div

                  className="

                    flex

                    justify-between

                    border-t

                    border-[#EDE1D7]

                    pt-4

                    text-xl

                    font-bold

                  "

                >

                  <span>
                    Total
                  </span>

                  <span

                    className="

                      text-[#FF5C35]

                    "

                  >

                    {currency}

                    {totalAmount}

                  </span>

                </div>

              </div>

            </section>


            {/* PAYMENT */}

            <section

              className="

                rounded-[2rem]

                border

                border-[#F0E2D7]

                bg-white

                p-6

                shadow-xl

              "

            >

              <h2

                className="

                  text-2xl

                  font-bold

                  text-[#181D27]

                "

              >

                Payment Details

              </h2>


              <div

                className="

                  mt-5

                  space-y-3

                "

              >

                <button

                  type="button"

                  onClick={() =>

                    setPaymentMethod(
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

                        ?

                        "border-[#FF5C35] bg-[#FFF5F0]"

                        :

                        "border-[#EEE2D8]"

                    }

                  `}

                >

                  <div

                    className="

                      flex

                      items-center

                      gap-3

                    "

                  >

                    <Banknote
                      size={24}
                    />


                    <div>

                      <p

                        className="

                          font-bold

                        "

                      >

                        Cash on Delivery

                      </p>


                      <p

                        className="

                          text-xs

                          text-[#82796F]

                        "

                      >

                        Pay when delivered

                      </p>

                    </div>

                  </div>


                  <div

                    className={`

                      h-5

                      w-5

                      rounded-full

                      border-2

                      p-1

                      ${

                        paymentMethod ===
                        "COD"

                          ?

                          "border-[#FF5C35]"

                          :

                          "border-[#CFC4BA]"

                      }

                    `}

                  >

                    {paymentMethod ===
                      "COD" && (

                      <div

                        className="

                          h-full

                          w-full

                          rounded-full

                          bg-[#FF5C35]

                        "

                      />

                    )}

                  </div>

                </button>


                <button

                  type="button"

                  onClick={() =>

                    setPaymentMethod(
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

                        ?

                        "border-[#FF5C35] bg-[#FFF5F0]"

                        :

                        "border-[#EEE2D8]"

                    }

                  `}

                >

                  <div

                    className="

                      flex

                      items-center

                      gap-3

                    "

                  >

                    <img

                      src={
                        razorpayLogo
                      }

                      alt="Razorpay"

                      className="

                        h-9

                        w-9

                        rounded-lg

                        object-contain

                      "

                    />


                    <div>

                      <p

                        className="

                          font-bold

                        "

                      >

                        Razorpay

                      </p>


                      <p

                        className="

                          text-xs

                          text-[#82796F]

                        "

                      >

                        Coming soon

                      </p>

                    </div>

                  </div>

                </button>

              </div>


              {errorMessage && (

                <div

                  className="

                    mt-5

                    rounded-xl

                    border

                    border-red-200

                    bg-red-50

                    px-4

                    py-3

                    text-sm

                    text-red-600

                  "

                >

                  {errorMessage}

                </div>

              )}


              <motion.button

                type="submit"

                disabled={
                  placingOrder
                }

                whileTap={{

                  scale: 0.98,

                }}

                className="

                  mt-6

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

                  disabled:opacity-70

                "

              >

                {placingOrder ? (

                  <>

                    <LoaderCircle

                      size={21}

                      className="

                        animate-spin

                      "

                    />

                    Placing Order...

                  </>

                ) : (

                  <>

                    <PackageCheck
                      size={21}
                    />

                    PLACE ORDER

                    <ChevronRight
                      size={20}
                    />

                  </>

                )}

              </motion.button>


              <div

                className="

                  mt-4

                  flex

                  items-center

                  justify-center

                  gap-2

                  text-xs

                  text-[#82796F]

                "

              >

                <ShieldCheck
                  size={15}
                />

                Secure and protected checkout

              </div>

            </section>

          </aside>

        </form>

      </main>

    </>

  );

}


export default PlaceOrder;