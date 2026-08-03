import React, {
  useContext,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaShoppingCart,
  FaStar,
  FaTimes,
} from "react-icons/fa";

import {
  shopDataContext,
} from "../context/ShopContext";


function Card({ product }) {

  const navigate =
    useNavigate();


  const {

    currency,

    addToCart,

  } = useContext(
    shopDataContext
  );


  // ==========================================
  // SIZE POPUP STATE
  // ==========================================

  const [

    showSizePopup,

    setShowSizePopup,

  ] = useState(
    false
  );


  // ==========================================
  // SELECTED SIZE
  // ==========================================

  const [

    selectedSize,

    setSelectedSize,

  ] = useState(
    ""
  );


  // ==========================================
  // ERROR MESSAGE
  // ==========================================

  const [

    sizeError,

    setSizeError,

  ] = useState(
    ""
  );


  // ==========================================
  // PRODUCT RATING
  // ==========================================

  const rating =
    product.rating || 0;


  const reviewCount =
    product.reviewCount || 0;


  // ==========================================
  // OPEN SIZE POPUP
  // ==========================================

  const handleAddToCart = (
    event
  ) => {

    event.stopPropagation();


    setSelectedSize(
      ""
    );


    setSizeError(
      ""
    );


    setShowSizePopup(
      true
    );

  };


  // ==========================================
  // SELECT SIZE
  // ==========================================

  const handleSizeSelect = (
    event,
    size
  ) => {

    event.stopPropagation();


    setSelectedSize(
      size
    );


    setSizeError(
      ""
    );

  };


  // ==========================================
  // FINAL ADD TO CART
  // ==========================================

  const handleConfirmAddToCart = (
    event
  ) => {

    event.stopPropagation();


    if (
      !selectedSize
    ) {

      setSizeError(

        "Please select a size before adding the product."

      );


      return;

    }


    addToCart(

      product._id,

      selectedSize,

      1

    );


    setShowSizePopup(
      false
    );


    setSelectedSize(
      ""
    );


    setSizeError(
      ""
    );

  };


  // ==========================================
  // CLOSE POPUP
  // ==========================================

  const handleClosePopup = (
    event
  ) => {

    event.stopPropagation();


    setShowSizePopup(
      false
    );


    setSelectedSize(
      ""
    );


    setSizeError(
      ""
    );

  };


  // ==========================================
  // PRODUCT CLICK
  // ==========================================

  const handleProductClick =
    () => {

      navigate(

        `/product/${product._id}`

      );

    };


  return (

    <>

      {/* ====================================== */}
      {/* PRODUCT CARD */}
      {/* ====================================== */}

      <motion.div

        whileHover={{

          y: -10,

          scale: 1.02,

        }}

        transition={{

          duration: 0.35,

        }}

        onClick={
          handleProductClick
        }

        className="

          group

          w-full

          max-w-[420px]

          cursor-pointer

          overflow-hidden

          rounded-[32px]

          bg-white

          shadow-md

          transition-all

          duration-500

          hover:shadow-2xl

        "

      >


        {/* ==================================== */}
        {/* PRODUCT IMAGE */}
        {/* ==================================== */}

        <div

          className="

            relative

            overflow-hidden

            bg-[#F8F5EF]

          "

        >


          {/* BESTSELLER */}

          {product.bestseller && (

            <div

              className="

                absolute

                left-5

                top-5

                z-20

                rounded-full

                bg-[#FF6A3D]

                px-4

                py-2

                text-xs

                font-semibold

                tracking-wide

                text-white

                shadow-lg

              "

            >

              Bestseller

            </div>

          )}


          {/* IMAGE */}

          <img

            src={
              product.image1
            }

            alt={
              product.name
            }

            className="

              aspect-square

              w-full

              object-cover

              transition-all

              duration-700

              group-hover:scale-110

              group-hover:brightness-95

            "

          />

        </div>


        {/* ==================================== */}
        {/* PRODUCT CONTENT */}
        {/* ==================================== */}

        <div

          className="

            px-7

            py-6

          "

        >


          {/* PRODUCT NAME */}

          <h3

            className="

              line-clamp-1

              text-center

              text-2xl

              font-bold

              text-[#14172E]

            "

          >

            {product.name}

          </h3>


          {/* RATING */}

          <div

            className="

              mt-4

              flex

              items-center

              justify-center

              gap-1

            "

          >

            {[

              1,

              2,

              3,

              4,

              5,

            ].map(

              (star) => (

                <FaStar

                  key={
                    star
                  }

                  className={

                    star <=
                    Math.round(
                      rating
                    )

                      ?

                      "text-sm text-yellow-400"

                      :

                      "text-sm text-gray-300"

                  }

                />

              )

            )}


            <span

              className="

                ml-2

                text-sm

                text-gray-500

              "

            >

              {rating > 0

                ?

                rating.toFixed(
                  1
                )

                :

                "No ratings"

              }

            </span>


            {reviewCount > 0 && (

              <span

                className="

                  text-sm

                  text-gray-400

                "

              >

                (

                {reviewCount}

                )

              </span>

            )}

          </div>


          {/* PRICE */}

          <div

            className="

              mt-6

              text-center

            "

          >

            <span

              className="

                text-4xl

                font-bold

                text-[#FF6A3D]

              "

            >

              {currency}

              {product.price}

            </span>

          </div>


          {/* ADD TO CART */}

          <motion.button

            type="button"

            whileHover={{

              scale: 1.03,

            }}

            whileTap={{

              scale: 0.95,

            }}

            onClick={
              handleAddToCart
            }

            className="

              mt-7

              flex

              w-full

              items-center

              justify-center

              gap-3

              rounded-2xl

              bg-[#14172E]

              py-4

              text-lg

              font-semibold

              text-white

              transition-all

              duration-300

              hover:bg-[#FF6A3D]

            "

          >

            <FaShoppingCart />

            Add to Cart

          </motion.button>

        </div>

      </motion.div>


      {/* ====================================== */}
      {/* SIZE SELECTION POPUP */}
      {/* ====================================== */}

      <AnimatePresence>

        {showSizePopup && (

          <motion.div

            initial={{

              opacity: 0,

            }}

            animate={{

              opacity: 1,

            }}

            exit={{

              opacity: 0,

            }}

            onClick={
              handleClosePopup
            }

            className="

              fixed

              inset-0

              z-[9999]

              flex

              items-center

              justify-center

              bg-black/60

              px-4

              py-6

              backdrop-blur-sm

            "

          >


            {/* POPUP BOX */}

            <motion.div

              initial={{

                opacity: 0,

                scale: 0.85,

                y: 30,

              }}

              animate={{

                opacity: 1,

                scale: 1,

                y: 0,

              }}

              exit={{

                opacity: 0,

                scale: 0.85,

                y: 30,

              }}

              transition={{

                type: "spring",

                stiffness: 280,

                damping: 23,

              }}

              onClick={

                (event) =>

                  event.stopPropagation()

              }

              className="

                relative

                w-full

                max-w-md

                overflow-hidden

                rounded-[32px]

                bg-white

                shadow-2xl

              "

            >


              {/* CLOSE BUTTON */}

              <button

                type="button"

                onClick={
                  handleClosePopup
                }

                className="

                  absolute

                  right-5

                  top-5

                  z-20

                  flex

                  h-10

                  w-10

                  items-center

                  justify-center

                  rounded-full

                  bg-gray-100

                  text-gray-600

                  transition

                  hover:bg-[#FF6A3D]

                  hover:text-white

                "

              >

                <FaTimes />

              </button>


              {/* PRODUCT PREVIEW */}

              <div

                className="

                  flex

                  items-center

                  gap-4

                  bg-[#F8F5EF]

                  p-6

                  pr-16

                "

              >

                <img

                  src={
                    product.image1
                  }

                  alt={
                    product.name
                  }

                  className="

                    h-20

                    w-20

                    rounded-2xl

                    object-cover

                  "

                />


                <div>

                  <h2

                    className="

                      line-clamp-2

                      text-xl

                      font-bold

                      text-[#14172E]

                    "

                  >

                    {product.name}

                  </h2>


                  <p

                    className="

                      mt-1

                      text-lg

                      font-bold

                      text-[#FF6A3D]

                    "

                  >

                    {currency}

                    {product.price}

                  </p>

                </div>

              </div>


              {/* SIZE CONTENT */}

              <div

                className="

                  p-6

                  sm:p-8

                "

              >


                <h3

                  className="

                    text-2xl

                    font-bold

                    text-[#14172E]

                  "

                >

                  Select your size

                </h3>


                <p

                  className="

                    mt-2

                    text-sm

                    text-gray-500

                  "

                >

                  Choose the size that fits you best.

                </p>


                {/* SIZE BUTTONS */}

                <div

                  className="

                    mt-6

                    grid

                    grid-cols-3

                    gap-3

                    sm:grid-cols-4

                  "

                >

                  {(

                    product.sizes &&

                    product.sizes.length > 0

                      ?

                      product.sizes

                      :

                      [

                        "S",

                        "M",

                        "L",

                        "XL",

                      ]

                  ).map(

                    (size) => (

                      <button

                        key={
                          size
                        }

                        type="button"

                        onClick={

                          (event) =>

                            handleSizeSelect(

                              event,

                              size

                            )

                        }

                        className={`

                          rounded-xl

                          border-2

                          px-4

                          py-3

                          font-bold

                          transition-all

                          duration-200

                          ${

                            selectedSize ===

                            size

                              ?

                              "border-[#FF6A3D] bg-[#FF6A3D] text-white shadow-lg"

                              :

                              "border-gray-200 bg-white text-[#14172E] hover:border-[#FF6A3D]"

                          }

                        `}

                      >

                        {size}

                      </button>

                    )

                  )}

                </div>


                {/* ERROR */}

                {sizeError && (

                  <p

                    className="

                      mt-4

                      rounded-xl

                      bg-red-50

                      px-4

                      py-3

                      text-sm

                      font-medium

                      text-red-600

                    "

                  >

                    {sizeError}

                  </p>

                )}


                {/* CONFIRM BUTTON */}

                <motion.button

                  type="button"

                  whileHover={{

                    scale: 1.02,

                  }}

                  whileTap={{

                    scale: 0.98,

                  }}

                  onClick={

                    handleConfirmAddToCart

                  }

                  className="

                    mt-7

                    flex

                    w-full

                    items-center

                    justify-center

                    gap-3

                    rounded-2xl

                    bg-[#14172E]

                    py-4

                    text-lg

                    font-bold

                    text-white

                    transition

                    hover:bg-[#FF6A3D]

                  "

                >

                  <FaShoppingCart />

                  Add Size

                  {" "}

                  {selectedSize || "—"}

                  {" "}

                  to Cart

                </motion.button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </>

  );

}


export default Card;