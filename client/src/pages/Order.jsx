import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  Package,
  ShoppingBag,
  MapPin,
  CreditCard,
  CalendarDays,
  CircleCheck,
  LoaderCircle,
  ArrowLeft,
  ChevronRight,
  ReceiptIndianRupee,
  Truck,
} from "lucide-react";

import Nav from "../components/Nav";

import {
  authDataContext,
} from "../context/Authcontext";


function Order() {

  const navigate =
    useNavigate();


  const {
    serverUrl,
  } = useContext(
    authDataContext
  );


  // ==========================================
  // STATES
  // ==========================================

  const [
    orders,
    setOrders,
  ] = useState(
    []
  );


  const [
    loading,
    setLoading,
  ] = useState(
    true
  );


  const [
    errorMessage,
    setErrorMessage,
  ] = useState(
    ""
  );


  // ==========================================
  // GET USER ORDERS
  // ==========================================

  const getUserOrders =
    async () => {

      try {

        setLoading(
          true
        );


        setErrorMessage(
          ""
        );


        const result =
          await axios.get(

            `${serverUrl}/api/order/myorders`,

            {

              withCredentials:
                true,

            }

          );


        console.log(

          "My Orders Result:",

          result.data

        );


        if (
          result.data.success
        ) {

          setOrders(

            result.data.orders ||

            []

          );

        } else {

          setErrorMessage(

            result.data.message ||

            "Unable to fetch your orders."

          );

        }

      } catch (error) {

        console.log(

          "Get Orders Error:",

          error.response?.data ||

          error.message

        );


        setErrorMessage(

          error.response?.data?.message ||

          "Unable to load your orders."

        );

      } finally {

        setLoading(
          false
        );

      }

    };


  // ==========================================
  // FETCH ON PAGE LOAD
  // ==========================================

  useEffect(

    () => {

      getUserOrders();

    },

    []

  );


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate =
    (dateValue) => {

      if (
        !dateValue
      ) {

        return "Date unavailable";

      }


      return new Date(

        dateValue

      ).toLocaleDateString(

        "en-IN",

        {

          day:
            "numeric",

          month:
            "long",

          year:
            "numeric",

        }

      );

    };


  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle =
    (status) => {

      const currentStatus =

        String(
          status || "Placed"
        ).toLowerCase();


      if (
        currentStatus ===
        "delivered"
      ) {

        return {

          text:

            "Delivered",


          className:

            "bg-green-50 text-green-700 border-green-200",

        };

      }


      if (
        currentStatus ===
        "cancelled"
      ) {

        return {

          text:

            "Cancelled",


          className:

            "bg-red-50 text-red-600 border-red-200",

        };

      }


      if (
        currentStatus ===
        "shipped"
      ) {

        return {

          text:

            "Shipped",


          className:

            "bg-blue-50 text-blue-700 border-blue-200",

        };

      }


      return {

        text:

          status || "Placed",


        className:

          "bg-orange-50 text-[#E85B36] border-orange-200",

      };

    };


  // ==========================================
  // LOADING PAGE
  // ==========================================

  if (
    loading
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

          "

        >

          <div

            className="

              flex

              flex-col

              items-center

              gap-4

              text-center

            "

          >

            <div

              className="

                flex

                h-20

                w-20

                items-center

                justify-center

                rounded-full

                bg-[#FFF0E9]

                text-[#FF5C35]

              "

            >

              <LoaderCircle

                size={38}

                className="

                  animate-spin

                "

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

                Loading your orders

              </h2>


              <p

                className="

                  mt-2

                  text-[#82796F]

                "

              >

                Fetching your FurEver purchases...

              </p>

            </div>

          </div>

        </main>

      </>

    );

  }


  // ==========================================
  // ERROR PAGE
  // ==========================================

  if (
    errorMessage
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

              border-red-100

              bg-white

              p-8

              text-center

              shadow-xl

            "

          >

            <div

              className="

                mx-auto

                flex

                h-20

                w-20

                items-center

                justify-center

                rounded-full

                bg-red-50

                text-red-500

              "

            >

              <Package

                size={38}

              />

            </div>


            <h1

              className="

                mt-6

                text-3xl

                font-bold

                text-[#181D27]

              "

            >

              Unable to load orders

            </h1>


            <p

              className="

                mt-3

                text-[#82796F]

              "

            >

              {errorMessage}

            </p>


            <button

              type="button"

              onClick={
                getUserOrders
              }

              className="

                mt-7

                rounded-full

                bg-[#FF5C35]

                px-7

                py-3.5

                font-bold

                text-white

                transition

                hover:bg-[#E94B27]

              "

            >

              Try Again

            </button>

          </div>

        </main>

      </>

    );

  }


  // ==========================================
  // EMPTY ORDERS
  // ==========================================

  if (
    orders.length === 0
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

              opacity:
                0,

              y:
                25,

            }}

            animate={{

              opacity:
                1,

              y:
                0,

            }}

            className="

              w-full

              max-w-xl

              rounded-[2rem]

              border

              border-[#F0E2D7]

              bg-white

              p-8

              text-center

              shadow-xl

              sm:p-12

            "

          >

            <div

              className="

                mx-auto

                flex

                h-24

                w-24

                items-center

                justify-center

                rounded-full

                bg-[#FFF1EA]

                text-[#FF5C35]

              "

            >

              <ShoppingBag

                size={43}

              />

            </div>


            <h1

              className="

                mt-7

                text-3xl

                font-bold

                text-[#181D27]

              "

            >

              No orders yet

            </h1>


            <p

              className="

                mx-auto

                mt-3

                max-w-md

                text-[#82796F]

              "

            >

              Your FurEver orders will appear here after you complete checkout.

            </p>


            <button

              type="button"

              onClick={() =>

                navigate(
                  "/collections"
                )

              }

              className="

                mt-8

                inline-flex

                items-center

                gap-2

                rounded-full

                bg-[#FF5C35]

                px-7

                py-3.5

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

          </motion.div>

        </main>

      </>

    );

  }


  // ==========================================
  // ORDERS PAGE
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

            w-full

            max-w-[1500px]

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

              sm:items-end

              sm:justify-between

            "

          >

            <div>

              <button

                type="button"

                onClick={() =>

                  navigate(
                    "/"
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

                  transition

                  hover:text-[#FF5C35]

                "

              >

                <ArrowLeft
                  size={18}
                />

                Back to Home

              </button>


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

                    h-14

                    w-14

                    items-center

                    justify-center

                    rounded-2xl

                    bg-[#FF5C35]

                    text-white

                    shadow-lg

                    shadow-[#FF5C35]/20

                  "

                >

                  <Package
                    size={27}
                  />

                </div>


                <div>

                  <h1

                    className="

                      text-4xl

                      font-bold

                      text-[#181D27]

                      sm:text-5xl

                    "

                  >

                    My

                    <span

                      className="

                        ml-2

                        text-[#FF5C35]

                      "

                    >

                      Orders

                    </span>

                  </h1>


                  <p

                    className="

                      mt-1

                      text-[#82796F]

                    "

                  >

                    Track and review your FurEver purchases.

                  </p>

                </div>

              </div>

            </div>


            <div

              className="

                rounded-2xl

                border

                border-[#F0E2D7]

                bg-white

                px-5

                py-4

                shadow-sm

              "

            >

              <p

                className="

                  text-xs

                  font-semibold

                  uppercase

                  tracking-wider

                  text-[#A59A90]

                "

              >

                Total Orders

              </p>


              <p

                className="

                  mt-1

                  text-2xl

                  font-bold

                  text-[#FF5C35]

                "

              >

                {orders.length}

              </p>

            </div>

          </div>


          {/* ORDER CARDS */}

          <div

            className="

              space-y-7

            "

          >

            {orders.map(

              (
                order,
                orderIndex
              ) => {

                const statusData =

                  getStatusStyle(

                    order.status

                  );


                const orderItems =

                  Array.isArray(

                    order.items

                  )

                    ?

                    order.items

                    :

                    [];


                return (

                  <motion.article

                    key={

                      order._id ||

                      orderIndex

                    }

                    initial={{

                      opacity:
                        0,

                      y:
                        25,

                    }}

                    animate={{

                      opacity:
                        1,

                      y:
                        0,

                    }}

                    transition={{

                      delay:

                        orderIndex *

                        0.08,

                    }}

                    className="

                      overflow-hidden

                      rounded-[2rem]

                      border

                      border-[#F0E2D7]

                      bg-white

                      shadow-xl

                      shadow-[#2C1B10]/5

                    "

                  >


                    {/* ORDER TOP */}

                    <div

                      className="

                        flex

                        flex-col

                        gap-5

                        border-b

                        border-[#F2E7DF]

                        bg-[#FFF9F4]

                        px-5

                        py-5

                        sm:px-7

                        lg:flex-row

                        lg:items-center

                        lg:justify-between

                      "

                    >

                      <div

                        className="

                          flex

                          flex-wrap

                          items-center

                          gap-x-7

                          gap-y-4

                        "

                      >

                        <div>

                          <p

                            className="

                              text-xs

                              font-semibold

                              uppercase

                              tracking-wider

                              text-[#A59A90]

                            "

                          >

                            Order ID

                          </p>


                          <p

                            className="

                              mt-1

                              font-bold

                              text-[#181D27]

                            "

                          >

                            #

                            {String(

                              order._id ||

                              ""

                            ).slice(

                              -8

                            ).toUpperCase()}

                          </p>

                        </div>


                        <div>

                          <p

                            className="

                              flex

                              items-center

                              gap-1.5

                              text-xs

                              font-semibold

                              uppercase

                              tracking-wider

                              text-[#A59A90]

                            "

                          >

                            <CalendarDays
                              size={13}
                            />

                            Order Date

                          </p>


                          <p

                            className="

                              mt-1

                              font-semibold

                              text-[#181D27]

                            "

                          >

                            {formatDate(

                              order.createdAt ||

                              order.date

                            )}

                          </p>

                        </div>


                        <div>

                          <p

                            className="

                              text-xs

                              font-semibold

                              uppercase

                              tracking-wider

                              text-[#A59A90]

                            "

                          >

                            Payment

                          </p>


                          <p

                            className="

                              mt-1

                              font-semibold

                              text-[#181D27]

                            "

                          >

                            {

                              order.paymentMethod ||

                              "COD"

                            }

                          </p>

                        </div>

                      </div>


                      <div

                        className={`

                          inline-flex

                          w-fit

                          items-center

                          gap-2

                          rounded-full

                          border

                          px-4

                          py-2

                          text-sm

                          font-bold

                          ${

                            statusData.className

                          }

                        `}

                      >

                        <CircleCheck
                          size={17}
                        />

                        {

                          statusData.text

                        }

                      </div>

                    </div>


                    {/* ORDER BODY */}

                    <div

                      className="

                        grid

                        grid-cols-1

                        gap-7

                        p-5

                        sm:p-7

                        xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.65fr)]

                      "

                    >


                      {/* PRODUCTS */}

                      <div>

                        <div

                          className="

                            mb-5

                            flex

                            items-center

                            justify-between

                          "

                        >

                          <h2

                            className="

                              text-xl

                              font-bold

                              text-[#181D27]

                            "

                          >

                            Items in this order

                          </h2>


                          <span

                            className="

                              rounded-full

                              bg-[#FFF1EA]

                              px-3

                              py-1

                              text-xs

                              font-bold

                              text-[#FF5C35]

                            "

                          >

                            {

                              orderItems.length

                            }

                            {" "}

                            item

                            {

                              orderItems.length !== 1

                                ?

                                "s"

                                :

                                ""

                            }

                          </span>

                        </div>


                        <div

                          className="

                            space-y-4

                          "

                        >

                          {

                            orderItems.length > 0

                              ?

                              orderItems.map(

                                (
                                  item,
                                  itemIndex
                                ) => (

                                  <div

                                    key={

                                      `${

                                        item.productId ||

                                        item._id ||

                                        itemIndex

                                      }-${

                                        item.size ||

                                        "default"

                                      }-${

                                        itemIndex

                                      }`

                                    }

                                    className="

                                      flex

                                      flex-col

                                      gap-4

                                      rounded-2xl

                                      border

                                      border-[#F2E7DF]

                                      bg-[#FFFCFA]

                                      p-4

                                      sm:flex-row

                                      sm:items-center

                                    "

                                  >

                                    <img

                                      src={

                                        item.image ||

                                        ""

                                      }

                                      alt={

                                        item.name ||

                                        "Product"

                                      }

                                      onError={

                                        (

                                          event

                                        ) => {

                                          event.currentTarget.style.display =

                                            "none";

                                        }

                                      }

                                      className="

                                        h-24

                                        w-full

                                        rounded-xl

                                        bg-[#FFF1EA]

                                        object-cover

                                        sm:w-20

                                      "

                                    />


                                    <div

                                      className="

                                        min-w-0

                                        flex-1

                                      "

                                    >

                                      <h3

                                        className="

                                          truncate

                                          text-lg

                                          font-bold

                                          text-[#181D27]

                                        "

                                      >

                                        {

                                          item.name ||

                                          "FurEver Product"

                                        }

                                      </h3>


                                      <div

                                        className="

                                          mt-2

                                          flex

                                          flex-wrap

                                          gap-2

                                        "

                                      >

                                        <span

                                          className="

                                            rounded-full

                                            bg-white

                                            px-3

                                            py-1

                                            text-xs

                                            font-semibold

                                            text-[#6F655D]

                                            ring-1

                                            ring-[#EDE1D7]

                                          "

                                        >

                                          Size:

                                          {" "}

                                          {

                                            item.size ||

                                            "N/A"

                                          }

                                        </span>


                                        <span

                                          className="

                                            rounded-full

                                            bg-white

                                            px-3

                                            py-1

                                            text-xs

                                            font-semibold

                                            text-[#6F655D]

                                            ring-1

                                            ring-[#EDE1D7]

                                          "

                                        >

                                          Quantity:

                                          {" "}

                                          {

                                            item.quantity ||

                                            1

                                          }

                                        </span>

                                      </div>

                                    </div>


                                    <div

                                      className="

                                        sm:text-right

                                      "

                                    >

                                      <p

                                        className="

                                          text-lg

                                          font-bold

                                          text-[#FF5C35]

                                        "

                                      >

                                        ₹

                                        {

                                          Number(

                                            item.price ||

                                            0

                                          ) *

                                          Number(

                                            item.quantity ||

                                            1

                                          )

                                        }

                                      </p>

                                    </div>

                                  </div>

                                )

                              )

                              :

                              (

                                <p

                                  className="

                                    rounded-xl

                                    bg-[#FFF8F3]

                                    p-4

                                    text-sm

                                    text-[#82796F]

                                  "

                                >

                                  Product information is unavailable for this order.

                                </p>

                              )

                          }

                        </div>

                      </div>


                      {/* SUMMARY */}

                      <aside

                        className="

                          h-fit

                          rounded-[1.5rem]

                          border

                          border-[#F0E2D7]

                          bg-[#FFF9F4]

                          p-5

                        "

                      >

                        <div

                          className="

                            flex

                            items-center

                            gap-2

                          "

                        >

                          <ReceiptIndianRupee

                            size={21}

                            className="

                              text-[#FF5C35]

                            "

                          />


                          <h3

                            className="

                              text-lg

                              font-bold

                              text-[#181D27]

                            "

                          >

                            Order Summary

                          </h3>

                        </div>


                        <div

                          className="

                            mt-5

                            border-b

                            border-[#EDE1D7]

                            pb-5

                          "

                        >

                          <p

                            className="

                              text-xs

                              font-semibold

                              uppercase

                              tracking-wider

                              text-[#A59A90]

                            "

                          >

                            Total Amount

                          </p>


                          <p

                            className="

                              mt-1

                              text-3xl

                              font-bold

                              text-[#FF5C35]

                            "

                          >

                            ₹

                            {

                              Number(

                                order.amount ||

                                0

                              ).toLocaleString(

                                "en-IN"

                              )

                            }

                          </p>

                        </div>


                        <div

                          className="

                            mt-5

                            space-y-4

                          "

                        >

                          <div

                            className="

                              flex

                              gap-3

                            "

                          >

                            <CreditCard

                              size={19}

                              className="

                                mt-0.5

                                shrink-0

                                text-[#FF5C35]

                              "

                            />


                            <div>

                              <p

                                className="

                                  text-xs

                                  font-semibold

                                  uppercase

                                  tracking-wider

                                  text-[#A59A90]

                                "

                              >

                                Payment Method

                              </p>


                              <p

                                className="

                                  mt-1

                                  font-semibold

                                  text-[#181D27]

                                "

                              >

                                {

                                  order.paymentMethod ||

                                  "COD"

                                }

                              </p>

                            </div>

                          </div>


                          <div

                            className="

                              flex

                              gap-3

                            "

                          >

                            <Truck

                              size={19}

                              className="

                                mt-0.5

                                shrink-0

                                text-[#FF5C35]

                              "

                            />


                            <div>

                              <p

                                className="

                                  text-xs

                                  font-semibold

                                  uppercase

                                  tracking-wider

                                  text-[#A59A90]

                                "

                              >

                                Payment Status

                              </p>


                              <p

                                className="

                                  mt-1

                                  font-semibold

                                  text-[#181D27]

                                "

                              >

                                {

                                  order.payment

                                    ?

                                    "Paid"

                                    :

                                    "Pay on delivery"

                                }

                              </p>

                            </div>

                          </div>


                          <div

                            className="

                              flex

                              gap-3

                            "

                          >

                            <MapPin

                              size={19}

                              className="

                                mt-0.5

                                shrink-0

                                text-[#FF5C35]

                              "

                            />


                            <div

                              className="

                                min-w-0

                              "

                            >

                              <p

                                className="

                                  text-xs

                                  font-semibold

                                  uppercase

                                  tracking-wider

                                  text-[#A59A90]

                                "

                              >

                                Delivery Address

                              </p>


                              <p

                                className="

                                  mt-1

                                  text-sm

                                  leading-6

                                  text-[#5F5750]

                                "

                              >

                                {

                                  order.address?.firstName

                                }

                                {" "}

                                {

                                  order.address?.lastName

                                }

                                <br />

                                {

                                  order.address?.street

                                }

                                <br />

                                {

                                  order.address?.city

                                }

                                {order.address?.city &&

                                order.address?.state

                                  ?

                                  ", "

                                  :

                                  ""

                                }

                                {

                                  order.address?.state

                                }

                                <br />

                                {

                                  order.address?.zipcode

                                }

                                {order.address?.country

                                  ?

                                  `, ${

                                    order.address.country

                                  }`

                                  :

                                  ""

                                }

                              </p>

                            </div>

                          </div>

                        </div>

                      </aside>

                    </div>

                  </motion.article>

                );

              }

            )}

          </div>

        </div>

      </main>

    </>

  );

}


export default Order;