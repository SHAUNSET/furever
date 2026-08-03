import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaShoppingBag,
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaLock,
  FaArrowRight,
  FaBoxOpen,
  FaTruck,
} from "react-icons/fa";

import {
  shopDataContext,
} from "../context/ShopContext";

import Nav from "../components/Nav";


// ======================================================
// HELPER FUNCTIONS
// ======================================================

const formatINR = (amount) => {
  return Number(
    amount || 0
  ).toLocaleString(
    "en-IN"
  );
};


const makeKey = (
  productId,
  size
) => {
  return `${productId}__${size}`;
};


// ======================================================
// CART LOADING SKELETON
// ======================================================

const CartRowSkeleton = () => {

  return (

    <div className="flex items-center gap-4 bg-white rounded-2xl p-4 sm:p-5 shadow-sm animate-pulse w-full">

      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#F8F5EF] flex-shrink-0" />

      <div className="flex-1 min-w-0 space-y-3">

        <div className="h-4 w-2/3 rounded bg-[#F8F5EF]" />

        <div className="h-3 w-1/4 rounded bg-[#F8F5EF]" />

        <div className="h-8 w-28 rounded-full bg-[#F8F5EF]" />

      </div>

      <div className="hidden sm:block h-4 w-16 rounded bg-[#F8F5EF]" />

    </div>

  );

};


const CartSkeleton = () => {

  return (

    <div className="min-h-screen bg-[#F8F5EF]">

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">

        <div className="h-7 w-40 rounded bg-white/80 mb-8 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">

          <div className="lg:col-span-2 xl:col-span-3 space-y-4">

            {Array
              .from({
                length: 4,
              })
              .map(
                (_, index) => (

                  <CartRowSkeleton
                    key={index}
                  />

                )
              )}

          </div>


          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 animate-pulse">

              <div className="h-5 w-1/2 rounded bg-[#F8F5EF]" />

              <div className="h-4 w-full rounded bg-[#F8F5EF]" />

              <div className="h-4 w-full rounded bg-[#F8F5EF]" />

              <div className="h-4 w-full rounded bg-[#F8F5EF]" />

              <div className="h-11 w-full rounded-full bg-[#F8F5EF]" />

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


// ======================================================
// EMPTY CART
// ======================================================

const EmptyCart = ({
  onContinue,
}) => {

  return (

    <div className="min-h-[70vh] flex items-center justify-center px-4 w-full">

      <motion.div

        initial={{
          opacity: 0,
          y: 12,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}

        className="text-center max-w-md mx-auto"
      >

        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-[#FFF1EA] flex items-center justify-center">

          <FaBoxOpen
            className="text-[#FF6A3D] text-4xl"
          />

        </div>


        <h2 className="text-2xl sm:text-3xl font-bold text-[#14172E] mb-2">

          Your cart is waiting for something special.

        </h2>


        <p className="text-[#14172E]/60 mb-8 text-sm sm:text-base">

          Browse our latest collection and find
          something you love.

        </p>


        <button

          onClick={onContinue}

          className="inline-flex items-center gap-2 bg-[#14172E] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#1f2347] active:scale-[0.98] transition-all duration-200"

        >

          Continue Shopping

          <FaArrowRight />

        </button>

      </motion.div>

    </div>

  );

};


// ======================================================
// REMOVE CONFIRMATION MODAL
// ======================================================

const RemoveConfirmModal = ({

  item,

  isRemoving,

  onCancel,

  onConfirm,

}) => {

  return (

    <AnimatePresence>

      {item && (

        <motion.div

          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#14172E]/50 backdrop-blur-sm px-4 pb-4 sm:pb-0"

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          exit={{
            opacity: 0,
          }}

          onClick={onCancel}

        >

          <motion.div

            role="dialog"

            className="w-full sm:max-w-sm bg-white rounded-2xl shadow-xl p-6"

            initial={{
              opacity: 0,
              y: 30,
              scale: 0.98,
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}

            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}

            transition={{
              duration: 0.2,
            }}

            onClick={(event) => {
              event.stopPropagation();
            }}

          >

            <div className="w-12 h-12 rounded-full bg-[#FFF1EA] flex items-center justify-center mb-4">

              <FaTrash
                className="text-[#FF6A3D]"
              />

            </div>


            <h3 className="text-lg font-bold text-[#14172E] mb-1">

              Remove this item?

            </h3>


            <p className="text-sm text-[#14172E]/60 mb-6">

              {item.name}

              {" · "}

              Size {item.size}

              {" will be removed from your cart."}

            </p>


            <div className="flex gap-3">

              <button

                onClick={onCancel}

                disabled={isRemoving}

                className="flex-1 py-3 rounded-full border border-[#14172E]/15 text-[#14172E] font-medium hover:bg-[#F8F5EF] transition-colors disabled:opacity-50"

              >

                Cancel

              </button>


              <button

                onClick={onConfirm}

                disabled={isRemoving}

                className="flex-1 py-3 rounded-full bg-[#FF6A3D] text-white font-semibold hover:bg-[#e85a30] transition-colors disabled:opacity-70"

              >

                {isRemoving
                  ? "Removing..."
                  : "Remove"}

              </button>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

};


// ======================================================
// CART ITEM
// ======================================================

const CartRow = ({

  product,

  size,

  quantity,

  isUpdating,

  onIncrease,

  onDecrease,

  onRequestRemove,

}) => {

  return (

    <motion.div

      layout

      initial={{
        opacity: 0,
        y: 16,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      exit={{
        opacity: 0,
        x: -24,
      }}

      transition={{
        duration: 0.3,
      }}

      className="relative bg-white rounded-2xl shadow-sm hover:shadow-md p-4 sm:p-5 transition-shadow duration-300 w-full"

    >

      <div className="flex gap-4 sm:gap-6 items-center">


        {/* PRODUCT IMAGE */}

        <img

          src={product.image1}

          alt={product.name}

          className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl object-cover flex-shrink-0 bg-[#F8F5EF]"

        />


        {/* PRODUCT INFORMATION */}

        <div className="flex-1 min-w-0">

          <h3 className="text-[#14172E] font-semibold text-sm sm:text-base truncate">

            {product.name}

          </h3>


          <span className="inline-block mt-1.5 mb-2 text-xs font-medium text-[#14172E] bg-[#F8F5EF] px-2.5 py-1 rounded-full">

            Size: {size}

          </span>


          <p className="text-[#14172E]/50 text-xs sm:text-sm sm:hidden">

            ₹{formatINR(product.price)} each

          </p>


          {/* QUANTITY */}

          <div className="flex items-center gap-3 mt-2">

            <div className="flex items-center border border-[#14172E]/15 rounded-full overflow-hidden">

              <button

                type="button"

                onClick={onDecrease}

                disabled={isUpdating}

                className="w-8 h-8 flex items-center justify-center text-[#14172E] hover:bg-[#F8F5EF] disabled:opacity-40"

              >

                <FaMinus size={10} />

              </button>


              <span className="w-8 text-center text-sm font-semibold text-[#14172E]">

                {isUpdating
                  ? "..."
                  : quantity}

              </span>


              <button

                type="button"

                onClick={onIncrease}

                disabled={isUpdating}

                className="w-8 h-8 flex items-center justify-center text-[#14172E] hover:bg-[#F8F5EF] disabled:opacity-40"

              >

                <FaPlus size={10} />

              </button>

            </div>

          </div>

        </div>


        {/* DESKTOP PRICE */}

        <div className="hidden sm:flex flex-col items-end gap-3 flex-shrink-0">

          <p className="text-[#14172E]/50 text-sm">

            ₹{formatINR(product.price)} each

          </p>


          <p className="text-[#14172E] font-bold text-base">

            ₹{
              formatINR(
                product.price *
                quantity
              )
            }

          </p>


          <button

            type="button"

            onClick={onRequestRemove}

            className="text-[#14172E]/40 hover:text-[#FF6A3D] transition-colors p-2"

          >

            <FaTrash />

          </button>

        </div>

      </div>


      {/* MOBILE PRICE */}

      <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-[#14172E]/10">

        <p className="text-[#14172E] font-bold text-sm">

          ₹{
            formatINR(
              product.price *
              quantity
            )
          }

        </p>


        <button

          type="button"

          onClick={onRequestRemove}

          className="text-[#14172E]/40 hover:text-[#FF6A3D] p-2"

        >

          <FaTrash />

        </button>

      </div>

    </motion.div>

  );

};


// ======================================================
// ORDER SUMMARY
// ======================================================

const OrderSummary = ({

  currency,

  itemCount,

  subtotal,

  delivery,

  total,

  onCheckout,

  isCartEmpty,

}) => {

  return (

    <div className="bg-white rounded-2xl shadow-sm lg:sticky lg:top-28 p-6 sm:p-7 w-full">

      <h2 className="text-lg font-bold text-[#14172E] mb-5">

        Order Summary

      </h2>


      <div className="space-y-3 text-sm">


        <div className="flex justify-between text-[#14172E]/70">

          <span>

            Items ({itemCount})

          </span>


          <span>

            {currency}

            {formatINR(subtotal)}

          </span>

        </div>


        <div className="flex justify-between text-[#14172E]/70">

          <span className="flex items-center gap-1.5">

            <FaTruck size={12} />

            Delivery

          </span>


          <span>

            {delivery > 0

              ? (

                <>

                  {currency}

                  {formatINR(delivery)}

                </>

              )

              : (

                "Free"

              )

            }

          </span>

        </div>

      </div>


      <div className="border-t border-[#14172E]/10 my-5" />


      <div className="flex justify-between items-baseline mb-6">

        <span className="text-[#14172E] font-semibold">

          Total

        </span>


        <span className="text-[#14172E] font-bold text-xl">

          {currency}

          {formatINR(total)}

        </span>

      </div>


      <button

        type="button"

        onClick={onCheckout}

        disabled={isCartEmpty}

        className="w-full bg-[#FF6A3D] text-white font-semibold py-3.5 rounded-full hover:bg-[#e85a30] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"

      >

        Proceed to Checkout

        <FaArrowRight />

      </button>


      <p className="flex items-center justify-center gap-2 text-xs text-[#14172E]/50 mt-4">

        <FaLock size={10} />

        Secure checkout

      </p>

    </div>

  );

};


// ======================================================
// MAIN CART PAGE
// ======================================================

const Cart = () => {


  const navigate =
    useNavigate();


  const {

    products = [],

    cartItems = {},

    cartLoading,

    currency = "₹",

    deliveryFee = 50,

    updateQuantity,

    removeFromCart,

    getCartCount,

    getCartAmount,

  } = useContext(
    shopDataContext
  );


  const [
    updatingKeys,
    setUpdatingKeys,
  ] = useState(
    () => new Set()
  );


  const [
    removingKey,
    setRemovingKey,
  ] = useState(null);


  const [
    pendingRemoval,
    setPendingRemoval,
  ] = useState(null);


  const setKeyUpdating =
    useCallback(

      (
        key,
        value
      ) => {

        setUpdatingKeys(
          (previous) => {

            const next =
              new Set(
                previous
              );


            if (value) {

              next.add(
                key
              );

            } else {

              next.delete(
                key
              );

            }


            return next;

          }
        );

      },

      []

    );


  const cartEntries =
    useMemo(

      () => {

        return Object
          .entries(
            cartItems || {}
          )

          .flatMap(

            (
              [
                productId,
                sizes,
              ]
            ) =>

              Object
                .entries(
                  sizes || {}
                )

                .map(

                  (
                    [
                      size,
                      quantity,
                    ]
                  ) => ({

                    productId,

                    size,

                    quantity:
                      Number(
                        quantity
                      ),

                  })

                )

          )

          .filter(

            (item) =>

              item.quantity >
              0

          )

          .map(

            (item) => {

              const product =
                products.find(

                  (
                    currentProduct
                  ) =>

                    currentProduct._id ===
                    item.productId

                );


              return product

                ? {

                    ...item,

                    product,

                  }

                : null;

            }

          )

          .filter(
            Boolean
          );

      },

      [
        cartItems,
        products,
      ]

    );


  const isCartEmpty =

    cartEntries.length ===
    0;


  const subtotal =

    typeof getCartAmount ===
    "function"

      ? getCartAmount()

      : 0;


  const delivery =

    subtotal > 0

      ? Number(
          deliveryFee
        )

      : 0;


  const total =

    subtotal +
    delivery;


  const itemCount =

    typeof getCartCount ===
    "function"

      ? getCartCount()

      : 0;


  const handleChangeQuantity =
    useCallback(

      async (

        productId,

        size,

        nextQuantity

      ) => {

        const key =

          makeKey(

            productId,

            size

          );


        if (

          updatingKeys.has(
            key
          )

        ) {

          return;

        }


        setKeyUpdating(

          key,

          true

        );


        try {

          await Promise.resolve(

            updateQuantity(

              productId,

              size,

              nextQuantity

            )

          );

        } finally {

          setKeyUpdating(

            key,

            false

          );

        }

      },

      [

        updateQuantity,

        updatingKeys,

        setKeyUpdating,

      ]

    );


  const handleRequestRemove = (

    productId,

    size,

    name

  ) => {

    setPendingRemoval({

      productId,

      size,

      name,

    });

  };


  const handleCancelRemove = () => {

    if (
      removingKey
    ) {

      return;

    }


    setPendingRemoval(
      null
    );

  };


  const handleConfirmRemove =
    async () => {

      if (
        !pendingRemoval
      ) {

        return;

      }


      const {

        productId,

        size,

      } = pendingRemoval;


      const key =

        makeKey(

          productId,

          size

        );


      setRemovingKey(
        key
      );


      try {

        await Promise.resolve(

          removeFromCart(

            productId,

            size

          )

        );


        setPendingRemoval(
          null
        );

      } finally {

        setRemovingKey(
          null
        );

      }

    };


  // ==================================================
  // LOADING
  // ==================================================

  if (
    cartLoading
  ) {

    return (

      <>

        <Nav />

        <CartSkeleton />

      </>

    );

  }


  // ==================================================
  // EMPTY CART
  // ==================================================

  if (
    isCartEmpty
  ) {

    return (

      <div className="min-h-screen bg-[#F8F5EF] w-full">

        <Nav />

        <EmptyCart

          onContinue={() =>

            navigate(
              "/collections"
            )

          }

        />

      </div>

    );

  }


  // ==================================================
  // MAIN PAGE
  // ==================================================

  return (

    <div className="min-h-screen bg-[#F8F5EF] w-full">

      <Nav />


      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">


        {/* HEADER */}

        <div className="flex items-center justify-between mb-8">


          <div className="flex items-center gap-3">

            <FaShoppingBag
              className="text-[#FF6A3D] text-xl"
            />


            <h1 className="text-2xl sm:text-3xl font-bold text-[#14172E]">

              Your Cart

            </h1>

          </div>


          <button

            type="button"

            onClick={() =>

              navigate(
                "/collections"
              )

            }

            className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#14172E]/60 hover:text-[#14172E] transition-colors px-3 py-2"

          >

            <FaArrowLeft
              size={12}
            />

            Continue Shopping

          </button>

        </div>


        {/* CART GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 xl:gap-10">


          {/* CART ITEMS */}

          <div className="lg:col-span-2 xl:col-span-3 space-y-4">


            <AnimatePresence
              mode="popLayout"
            >

              {cartEntries.map(

                ({

                  productId,

                  size,

                  quantity,

                  product,

                }) => {


                  const key =

                    makeKey(

                      productId,

                      size

                    );


                  return (

                    <CartRow

                      key={key}

                      product={
                        product
                      }

                      size={
                        size
                      }

                      quantity={
                        quantity
                      }

                      isUpdating={

                        updatingKeys.has(
                          key
                        )

                      }

                      onIncrease={() =>

                        handleChangeQuantity(

                          productId,

                          size,

                          quantity + 1

                        )

                      }

                      onDecrease={() =>

                        handleChangeQuantity(

                          productId,

                          size,

                          quantity - 1

                        )

                      }

                      onRequestRemove={() =>

                        handleRequestRemove(

                          productId,

                          size,

                          product.name

                        )

                      }

                    />

                  );

                }

              )}

            </AnimatePresence>

          </div>


          {/* ORDER SUMMARY */}

          <div className="lg:col-span-1">

            <OrderSummary

              currency={
                currency
              }

              itemCount={
                itemCount
              }

              subtotal={
                subtotal
              }

              delivery={
                delivery
              }

              total={
                total
              }

              isCartEmpty={
                isCartEmpty
              }

              onCheckout={() =>

                navigate(
                  "/placeorder"
                )

              }

            />

          </div>

        </div>

      </div>


      {/* REMOVE MODAL */}

      <RemoveConfirmModal

        item={
          pendingRemoval
        }

        isRemoving={
          Boolean(
            removingKey
          )
        }

        onCancel={
          handleCancelRemove
        }

        onConfirm={
          handleConfirmRemove
        }

      />

    </div>

  );

};


export default Cart;