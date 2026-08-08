import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import axios from "axios";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Eye,
  IndianRupee,
  MapPin,
  Package,
  PackageCheck,
  PackageX,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
  User,
  X,
  XCircle,
  Clock3,
} from "lucide-react";

import Nav from "../component/Nav";
import Sidebar from "../component/Sidebar";

import {
  authDataContext,
} from "../context/AuthContext";


// ============================================================
// CONSTANTS
// ============================================================

const ORDER_STATUSES = [
  "Placed",
  "Processing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];


// ============================================================
// HELPER FUNCTIONS
// ============================================================

const normalizeText = (value = "") => {

  return String(value)

    .toLowerCase()

    .trim()

    .replace(
      /[^a-z0-9]/g,
      ""
    );

};


const formatPrice = (amount) => {

  return `₹${Number(
    amount || 0
  ).toLocaleString(
    "en-IN"
  )}`;

};


const formatDate = (dateValue) => {

  if (!dateValue) {
    return "—";
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

};


const formatTime = (dateValue) => {

  if (!dateValue) {
    return "";
  }

  const date =
    new Date(dateValue);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

};


const getCustomerDetails = (
  order
) => {

  const address =
    order?.address ||
    {};

  const user =

    order?.user ||

    order?.userId ||

    order?.customer ||

    {};


  const firstName =

    address?.firstName ||

    user?.firstName ||

    user?.name
      ?.split(" ")[0] ||

    "";


  const lastName =

    address?.lastName ||

    user?.lastName ||

    user?.name
      ?.split(" ")
      .slice(1)
      .join(" ") ||

    "";


  const fullName =

    [
      firstName,
      lastName,
    ]

      .filter(Boolean)

      .join(" ")

    ||

    user?.name ||

    order?.customerName ||

    "Customer";


  const phone =

    address?.phone ||

    address?.phoneNumber ||

    user?.phone ||

    user?.mobile ||

    order?.phone ||

    "No phone";


  const email =

    address?.email ||

    user?.email ||

    order?.email ||

    "";


  return {

    name:
      fullName,

    phone:
      phone,

    email:
      email,

  };

};


const getAddressText = (
  address = {}
) => {

  return [

    address?.street,

    address?.address,

    address?.area,

    address?.landmark,

    address?.city,

    address?.state,

    address?.zipcode ||

    address?.zipCode ||

    address?.pincode,

    address?.country,

  ]

    .filter(Boolean)

    .join(", ");

};


const getStatusStyle = (
  status
) => {

  const normalized =

    String(
      status ||
      "Placed"
    )

      .toLowerCase()

      .trim();


  if (
    normalized ===
    "delivered"
  ) {

    return {

      badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700",

      dot:
        "bg-emerald-500",

      icon:
        CheckCircle2,

    };

  }


  if (
    normalized ===
    "cancelled"
  ) {

    return {

      badge:
        "border-red-200 bg-red-50 text-red-600",

      dot:
        "bg-red-500",

      icon:
        XCircle,

    };

  }


  if (
    normalized ===
    "shipped"
  ) {

    return {

      badge:
        "border-blue-200 bg-blue-50 text-blue-700",

      dot:
        "bg-blue-500",

      icon:
        Truck,

    };

  }


  if (
    normalized ===
    "out for delivery"
  ) {

    return {

      badge:
        "border-purple-200 bg-purple-50 text-purple-700",

      dot:
        "bg-purple-500",

      icon:
        Truck,

    };

  }


  if (
    normalized ===
    "processing"
  ) {

    return {

      badge:
        "border-amber-200 bg-amber-50 text-amber-700",

      dot:
        "bg-amber-500",

      icon:
        RefreshCw,

    };

  }


  return {

    badge:
      "border-orange-200 bg-orange-50 text-orange-700",

    dot:
      "bg-[#FF6A3D]",

    icon:
      Clock3,

  };

};


// ============================================================
// TOAST
// ============================================================

function Toast({
  toast,
}) {

  if (!toast) {
    return null;
  }


  const isSuccess =

    toast.type ===
    "success";


  return (

    <AnimatePresence>

      <motion.div

        initial={{
          opacity: 0,
          y: -20,
          scale: 0.95,
        }}

        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}

        exit={{
          opacity: 0,
          y: -20,
          scale: 0.95,
        }}

        className={`
          fixed
          right-4
          top-5
          z-[500]
          flex
          max-w-[calc(100vw-32px)]
          items-center
          gap-3
          rounded-2xl
          border
          px-5
          py-4
          text-sm
          font-semibold
          shadow-2xl

          ${
            isSuccess

              ? `
                border-emerald-200
                bg-emerald-50
                text-emerald-700
              `

              : `
                border-red-200
                bg-red-50
                text-red-600
              `
          }
        `}

      >

        {

          isSuccess

            ? (
              <CheckCircle2
                size={20}
              />
            )

            : (
              <AlertCircle
                size={20}
              />
            )

        }

        <span>
          {toast.message}
        </span>

      </motion.div>

    </AnimatePresence>

  );

}


// ============================================================
// ANALYTICS CARD
// ============================================================

function AnalyticsCard({

  title,

  value,

  icon: Icon,

  iconClass,

  delay,

}) {

  return (

    <motion.div

      initial={{
        opacity: 0,
        y: 18,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.35,
        delay,
      }}

      whileHover={{
        y: -3,
      }}

      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[#F0E9DE]
        bg-white
        p-4
        shadow-sm
        transition-shadow
        hover:shadow-lg
        sm:p-6
      "

    >

      <div
        className="
          absolute
          -right-8
          -top-8
          h-28
          w-28
          rounded-full
          bg-[#FF6A3D]/5
        "
      />

      <div
        className="
          relative
          flex
          items-start
          justify-between
          gap-3
        "
      >

        <div
          className="
            min-w-0
          "
        >

          <p
            className="
              truncate
              text-[11px]
              font-medium
              text-[#8A8578]
              sm:text-sm
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-2
              truncate
              text-xl
              font-bold
              text-[#14172E]
              sm:text-3xl
            "
          >
            {value}
          </h3>

        </div>

        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-2xl
            sm:h-12
            sm:w-12

            ${iconClass}
          `}
        >

          <Icon
            size={21}
          />

        </div>

      </div>

    </motion.div>

  );

}


// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status,
}) {

  const style =
    getStatusStyle(
      status
    );


  const StatusIcon =
    style.icon;


  return (

    <span
      className={`
        inline-flex
        max-w-full
        items-center
        gap-2
        whitespace-nowrap
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-bold

        ${style.badge}
      `}
    >

      <span
        className={`
          h-1.5
          w-1.5
          shrink-0
          rounded-full

          ${style.dot}
        `}
      />

      <StatusIcon
        size={13}
      />

      {
        status ||
        "Placed"
      }

    </span>

  );

}


// ============================================================
// ORDER ITEMS
// ============================================================

function OrderItems({
  items,
}) {

  if (!items) {

    return (

      <p
        className="
          text-sm
          text-[#8A8578]
        "
      >
        No items available.
      </p>

    );

  }


  if (
    Array.isArray(
      items
    )
  ) {

    return (

      <div
        className="
          space-y-3
        "
      >

        {

          items.map(

            (
              item,
              index
            ) => (

              <div

                key={
                  item?._id ||
                  item?.productId ||
                  index
                }

                className="
                  flex
                  flex-col
                  gap-3
                  rounded-2xl
                  bg-[#FAF7F1]
                  px-4
                  py-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "

              >

                <div
                  className="
                    min-w-0
                  "
                >

                  <p
                    className="
                      truncate
                      text-sm
                      font-bold
                      text-[#14172E]
                    "
                  >

                    {

                      item?.name ||

                      item?.productName ||

                      item?.product?.name ||

                      "Product"

                    }

                  </p>

                  {

                    item?.size && (

                      <p
                        className="
                          mt-1
                          text-xs
                          text-[#8A8578]
                        "
                      >

                        Size:

                        {" "}

                        <b>
                          {item.size}
                        </b>

                      </p>

                    )

                  }

                </div>

                <span
                  className="
                    w-fit
                    shrink-0
                    rounded-full
                    border
                    border-[#E8E0D5]
                    bg-white
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                  "
                >

                  Qty:

                  {" "}

                  {

                    item?.quantity ||

                    item?.qty ||

                    1

                  }

                </span>

              </div>

            )

          )

        }

      </div>

    );

  }


  const itemRows = [];


  Object.entries(
    items
  ).forEach(

    ([
      productId,
      sizeData,
    ]) => {

      if (
        typeof sizeData ===
        "number"
      ) {

        itemRows.push({

          productId,

          size:
            "—",

          quantity:
            sizeData,

        });

      }

      else if (
        typeof sizeData ===
        "object" &&

        sizeData !==
        null
      ) {

        Object.entries(
          sizeData
        ).forEach(

          ([
            size,
            quantity,
          ]) => {

            if (
              Number(quantity) > 0
            ) {

              itemRows.push({

                productId,

                size,

                quantity,

              });

            }

          }

        );

      }

    }

  );


  if (
    itemRows.length ===
    0
  ) {

    return (

      <p
        className="
          text-sm
          text-[#8A8578]
        "
      >
        No items available.
      </p>

    );

  }


  return (

    <div
      className="
        space-y-3
      "
    >

      {

        itemRows.map(

          (
            item,
            index
          ) => (

            <div

              key={
                `${item.productId}-${item.size}-${index}`
              }

              className="
                flex
                flex-col
                gap-3
                rounded-2xl
                bg-[#FAF7F1]
                px-4
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "

            >

              <div>

                <p
                  className="
                    text-xs
                    font-bold
                    text-[#50546B]
                  "
                >

                  Product ID:

                  {" "}

                  {
                    String(
                      item.productId
                    ).slice(-8)
                  }

                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-[#8A8578]
                  "
                >

                  Size:

                  {" "}

                  <b>
                    {item.size}
                  </b>

                </p>

              </div>

              <span
                className="
                  w-fit
                  rounded-full
                  bg-white
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                "
              >

                Qty:

                {" "}

                {
                  item.quantity
                }

              </span>

            </div>

          )

        )

      }

    </div>

  );

}


// ============================================================
// ORDER DETAILS MODAL
// ============================================================

function OrderDetailsModal({

  order,

  onClose,

}) {

  const address =
    order?.address ||
    {};


  const customer =
    getCustomerDetails(
      order
    );


  const addressText =
    getAddressText(
      address
    );


  return (

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
        onClose
      }

      className="
        fixed
        inset-0
        z-[400]
        flex
        items-center
        justify-center
        bg-black/55
        p-3
        backdrop-blur-sm
        sm:p-6
      "

    >

      <motion.div

        initial={{
          opacity: 0,
          scale: 0.94,
          y: 20,
        }}

        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}

        exit={{
          opacity: 0,
          scale: 0.94,
          y: 20,
        }}

        onClick={(
          event
        ) => {

          event.stopPropagation();

        }}

        className="
          max-h-[92vh]
          w-full
          max-w-3xl
          overflow-y-auto
          rounded-3xl
          bg-white
          shadow-2xl
        "

      >

        <div
          className="
            sticky
            top-0
            z-20
            flex
            items-center
            justify-between
            border-b
            border-[#F0E9DE]
            bg-white
            px-5
            py-5
            sm:px-7
          "
        >

          <div
            className="
              min-w-0
            "
          >

            <h2
              className="
                text-xl
                font-bold
                text-[#14172E]
                sm:text-2xl
              "
            >
              Order Details
            </h2>

            <p
              className="
                mt-1
                truncate
                text-xs
                text-[#8A8578]
              "
            >

              #

              {
                String(
                  order?._id ||
                  ""
                )
                  .slice(-10)
                  .toUpperCase()
              }

            </p>

          </div>

          <button

            type="button"

            onClick={
              onClose
            }

            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#F5F0E8]
              transition-colors
              hover:bg-[#FFE7DB]
              hover:text-[#FF6A3D]
            "

          >

            <X
              size={20}
            />

          </button>

        </div>


        <div
          className="
            space-y-6
            p-5
            sm:p-7
          "
        >

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
            "
          >

            <div
              className="
                rounded-2xl
                bg-[#FAF7F1]
                p-5
              "
            >

              <CalendarDays
                size={18}
                className="
                  text-[#FF6A3D]
                "
              />

              <p
                className="
                  mt-3
                  font-bold
                  text-[#14172E]
                "
              >

                {
                  formatDate(
                    order?.createdAt
                  )
                }

              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-[#8A8578]
                "
              >

                {
                  formatTime(
                    order?.createdAt
                  )
                }

              </p>

            </div>


            <div
              className="
                rounded-2xl
                bg-[#FAF7F1]
                p-5
              "
            >

              <IndianRupee
                size={18}
                className="
                  text-[#FF6A3D]
                "
              />

              <p
                className="
                  mt-3
                  text-2xl
                  font-bold
                  text-[#FF6A3D]
                "
              >

                {
                  formatPrice(
                    order?.amount
                  )
                }

              </p>

            </div>

          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#F0E9DE]
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

              <User
                size={18}
                className="
                  text-[#FF6A3D]
                "
              />

              <h3
                className="
                  font-bold
                  text-[#14172E]
                "
              >
                Customer
              </h3>

            </div>

            <p
              className="
                mt-3
                font-bold
                text-[#14172E]
              "
            >
              {customer.name}
            </p>

            <div
              className="
                mt-2
                flex
                flex-wrap
                gap-x-4
                gap-y-2
                text-sm
                text-[#8A8578]
              "
            >

              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <Phone
                  size={14}
                />

                {customer.phone}

              </span>

              {

                customer.email && (

                  <span>
                    {customer.email}
                  </span>

                )

              }

            </div>

          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#F0E9DE]
              p-5
            "
          >

            <p
              className="
                text-xs
                font-bold
                text-[#8A8578]
              "
            >
              CURRENT STATUS
            </p>

            <div
              className="
                mt-3
              "
            >

              <StatusBadge
                status={
                  order?.status
                }
              />

            </div>

          </div>


          <div>

            <div
              className="
                mb-4
                flex
                items-center
                gap-2
              "
            >

              <ShoppingBag
                size={19}
                className="
                  text-[#FF6A3D]
                "
              />

              <h3
                className="
                  font-bold
                  text-[#14172E]
                "
              >
                Ordered Products
              </h3>

            </div>

            <OrderItems
              items={
                order?.items
              }
            />

          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#F0E9DE]
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

              <MapPin
                size={19}
                className="
                  text-[#FF6A3D]
                "
              />

              <h3
                className="
                  font-bold
                  text-[#14172E]
                "
              >
                Delivery Address
              </h3>

            </div>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-[#50546B]
              "
            >

              {

                addressText ||

                "Address information is unavailable."

              }

            </p>

          </div>


          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
            "
          >

            <div
              className="
                rounded-2xl
                bg-[#F5F7FF]
                p-5
              "
            >

              <CreditCard
                size={18}
                className="
                  text-[#5365D8]
                "
              />

              <p
                className="
                  mt-3
                  font-bold
                  text-[#14172E]
                "
              >

                {

                  order?.paymentMethod ||

                  "COD"

                }

              </p>

            </div>


            <div
              className="
                rounded-2xl
                bg-[#FAF7F1]
                p-5
              "
            >

              <p
                className="
                  text-xs
                  font-bold
                  text-[#8A8578]
                "
              >
                PAYMENT STATUS
              </p>

              <p
                className={`
                  mt-3
                  font-bold

                  ${
                    order?.payment

                      ? "text-emerald-600"

                      : "text-amber-600"
                  }
                `}
              >

                {

                  order?.payment

                    ? "Paid"

                    : "Pending / COD"

                }

              </p>

            </div>

          </div>

        </div>

      </motion.div>

    </motion.div>

  );

}


// ============================================================
// ORDER CARD
// ============================================================

function OrderCard({

  order,

  updatingId,

  onStatusChange,

  onView,

}) {

  const customer =
    getCustomerDetails(
      order
    );


  const isUpdating =

    updatingId ===
    order?._id;


  return (

    <motion.div

      layout

      initial={{
        opacity: 0,
        y: 10,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      exit={{
        opacity: 0,
        x: -20,
      }}

      className="
        rounded-3xl
        border
        border-[#F0E9DE]
        bg-white
        p-4
        shadow-sm
        transition-shadow
        hover:shadow-md
        sm:p-5
      "

    >

      <div
        className="
          flex
          flex-col
          gap-5
          2xl:flex-row
          2xl:items-center
          2xl:justify-between
        "
      >

        <div
          className="
            grid
            min-w-0
            flex-1
            grid-cols-1
            gap-5
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >

          <div
            className="
              min-w-0
            "
          >

            <p
              className="
                text-[10px]
                font-bold
                tracking-wider
                text-[#8A8578]
              "
            >
              ORDER ID
            </p>

            <p
              className="
                mt-2
                truncate
                font-bold
                text-[#14172E]
              "
            >

              #

              {

                String(
                  order?._id ||
                  ""
                )
                  .slice(-8)
                  .toUpperCase()

              }

            </p>

          </div>


          <div
            className="
              min-w-0
            "
          >

            <p
              className="
                text-[10px]
                font-bold
                tracking-wider
                text-[#8A8578]
              "
            >
              CUSTOMER
            </p>

            <p
              className="
                mt-2
                truncate
                font-bold
                text-[#14172E]
              "
            >
              {customer.name}
            </p>

            <p
              className="
                mt-1
                truncate
                text-xs
                text-[#8A8578]
              "
            >
              {customer.phone}
            </p>

          </div>


          <div>

            <p
              className="
                text-[10px]
                font-bold
                tracking-wider
                text-[#8A8578]
              "
            >
              AMOUNT
            </p>

            <p
              className="
                mt-2
                font-bold
                text-[#14172E]
              "
            >

              {
                formatPrice(
                  order?.amount
                )
              }

            </p>

            <p
              className="
                mt-1
                text-xs
                text-[#8A8578]
              "
            >

              {
                formatDate(
                  order?.createdAt
                )
              }

            </p>

          </div>


          <div>

            <p
              className="
                text-[10px]
                font-bold
                tracking-wider
                text-[#8A8578]
              "
            >
              STATUS
            </p>

            <div
              className="
                mt-2
              "
            >

              <StatusBadge
                status={
                  order?.status
                }
              />

            </div>

          </div>

        </div>


        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            2xl:items-center
          "
        >

          <div
            className="
              relative
              w-full
              sm:w-[210px]
            "
          >

            <select

              value={
                order?.status ||
                "Placed"
              }

              disabled={
                isUpdating
              }

              onChange={(
                event
              ) => {

                onStatusChange(

                  order._id,

                  event.target.value

                );

              }}

              className="
                w-full
                cursor-pointer
                appearance-none
                rounded-xl
                border
                border-[#E5DDD1]
                bg-[#FFFDFB]
                px-4
                py-3
                pr-11
                text-sm
                font-bold
                text-[#50546B]
                outline-none
                transition-all
                focus:border-[#FF6A3D]
                focus:ring-4
                focus:ring-[#FF6A3D]/10
                disabled:cursor-not-allowed
                disabled:opacity-60
              "

            >

              {

                ORDER_STATUSES.map(

                  (
                    status
                  ) => (

                    <option

                      key={
                        status
                      }

                      value={
                        status
                      }

                    >

                      {status}

                    </option>

                  )

                )

              }

            </select>

            <ChevronDown

              size={17}

              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[#8A8578]
              "

            />

          </div>


          <button

            type="button"

            onClick={
              () =>
                onView(
                  order
                )
            }

            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#14172E]
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition-colors
              hover:bg-[#FF6A3D]
              sm:w-auto
            "

          >

            <Eye
              size={17}
            />

            View

          </button>

        </div>

      </div>

    </motion.div>

  );

}


// ============================================================
// ORDER SECTION
// ============================================================

function OrderSection({

  title,

  description,

  icon: Icon,

  iconClass,

  countClass,

  orders,

  emptyText,

  emptyIcon: EmptyIcon,

  updatingId,

  onStatusChange,

  onView,

}) {

  return (

    <section>

      <div
        className="
          mb-5
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Icon
              size={21}
              className={
                iconClass
              }
            />

            <h2
              className="
                text-xl
                font-bold
                text-[#14172E]
                sm:text-2xl
              "
            >
              {title}
            </h2>

          </div>

          <p
            className="
              mt-1
              text-sm
              text-[#8A8578]
            "
          >
            {description}
          </p>

        </div>

        <span
          className={`
            shrink-0
            rounded-full
            px-4
            py-2
            text-sm
            font-bold

            ${countClass}
          `}
        >
          {orders.length}
        </span>

      </div>


      {

        orders.length ===
        0

          ? (

            <div
              className="
                rounded-3xl
                border
                border-dashed
                border-[#E5DDD1]
                bg-white
                py-14
                text-center
              "
            >

              <EmptyIcon
                size={36}
                className="
                  mx-auto
                  text-[#B4AFA1]
                "
              />

              <p
                className="
                  mt-4
                  font-bold
                  text-[#50546B]
                "
              >
                {emptyText}
              </p>

            </div>

          )

          : (

            <div
              className="
                space-y-4
              "
            >

              <AnimatePresence>

                {

                  orders.map(

                    (
                      order
                    ) => (

                      <OrderCard

                        key={
                          order._id
                        }

                        order={
                          order
                        }

                        updatingId={
                          updatingId
                        }

                        onStatusChange={
                          onStatusChange
                        }

                        onView={
                          onView
                        }

                      />

                    )

                  )

                }

              </AnimatePresence>

            </div>

          )

      }

    </section>

  );

}


// ============================================================
// MAIN COMPONENT
// ============================================================

function Orders() {

  const {
    serverUrl,
  } = useContext(
    authDataContext
  );


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
    refreshing,
    setRefreshing,
  ] = useState(
    false
  );


  const [
    searchTerm,
    setSearchTerm,
  ] = useState(
    ""
  );


  const [
    statusFilter,
    setStatusFilter,
  ] = useState(
    "All"
  );


  const [
    updatingId,
    setUpdatingId,
  ] = useState(
    null
  );


  const [
    selectedOrder,
    setSelectedOrder,
  ] = useState(
    null
  );


  const [
    toast,
    setToast,
  ] = useState(
    null
  );


  const toastTimer =
    useRef(
      null
    );


  // ==========================================================
  // TOAST
  // ==========================================================

  const showToast = (
    type,
    message
  ) => {

    if (
      toastTimer.current
    ) {

      window.clearTimeout(
        toastTimer.current
      );

    }


    setToast({

      type,

      message,

    });


    toastTimer.current =

      window.setTimeout(

        () => {

          setToast(
            null
          );

        },

        3000

      );

  };


  // ==========================================================
  // FETCH ORDERS
  // ==========================================================

  const fetchOrders = async (
    showLoader = true
  ) => {

    try {

      if (
        showLoader
      ) {

        setLoading(
          true
        );

      }


      const response =

        await axios.get(

          `${serverUrl}/api/order/allorders`,

          {

            withCredentials:
              true,

          }

        );


      const orderList =

        Array.isArray(
          response.data
        )

          ? response.data

          : (

            response.data?.orders ||

            response.data?.allOrders ||

            []

          );


      setOrders(
        orderList
      );

    }

    catch (
      error
    ) {

      console.log(
        "Fetch Orders Error:",
        error
      );


      showToast(

        "error",

        error?.response
          ?.data
          ?.message ||

        "Unable to load orders."

      );

    }

    finally {

      setLoading(
        false
      );

      setRefreshing(
        false
      );

    }

  };


  useEffect(

    () => {

      if (
        serverUrl
      ) {

        fetchOrders();

      }

    },

    [
      serverUrl
    ]

  );


  useEffect(

    () => {

      return () => {

        if (
          toastTimer.current
        ) {

          window.clearTimeout(
            toastTimer.current
          );

        }

      };

    },

    []

  );


  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh =
    () => {

      if (
        refreshing
      ) {
        return;
      }


      setRefreshing(
        true
      );


      fetchOrders(
        false
      );

    };


  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  const handleStatusChange = async (

    orderId,

    newStatus

  ) => {

    try {

      setUpdatingId(
        orderId
      );


      const response =

        await axios.put(

          `${serverUrl}/api/order/updatestatus/${orderId}`,

          {

            status:
              newStatus,

          },

          {

            withCredentials:
              true,

          }

        );


      const updatedOrder =

        response.data?.order;


      setOrders(

        (
          previousOrders
        ) =>

          previousOrders.map(

            (
              order
            ) =>

              order._id ===
              orderId

                ? {

                  ...order,

                  ...updatedOrder,

                  status:

                    updatedOrder?.status ||

                    newStatus,

                }

                : order

          )

      );


      setSelectedOrder(

        (
          previousOrder
        ) => {

          if (
            !previousOrder
          ) {

            return null;

          }


          if (
            previousOrder._id ===
            orderId
          ) {

            return {

              ...previousOrder,

              ...updatedOrder,

              status:

                updatedOrder?.status ||

                newStatus,

            };

          }


          return previousOrder;

        }

      );


      showToast(

        "success",

        `Order status changed to ${newStatus}.`

      );

    }

    catch (
      error
    ) {

      console.log(
        "Update Status Error:",
        error
      );


      showToast(

        "error",

        error?.response
          ?.data
          ?.message ||

        "Unable to update order status."

      );

    }

    finally {

      setUpdatingId(
        null
      );

    }

  };


  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  const clearFilters =
    () => {

      setSearchTerm(
        ""
      );

      setStatusFilter(
        "All"
      );

    };


  // ==========================================================
  // ENHANCED SEARCH + FILTER
  // ==========================================================

  const filteredOrders =

    useMemo(

      () => {

        const normalizedQuery =

          normalizeText(
            searchTerm
          );


        return orders.filter(

          (
            order
          ) => {

            const customer =

              getCustomerDetails(
                order
              );


            const address =

              order?.address ||

              {};


            const searchableValues = [

              order?._id,

              String(
                order?._id ||
                ""
              ).slice(-8),

              customer.name,

              customer.phone,

              customer.email,

              order?.customerName,

              order?.status,

              address?.city,

              address?.state,

              address?.pincode,

              address?.zipcode,

            ];


            const matchesSearch =

              !normalizedQuery ||

              searchableValues.some(

                (
                  value
                ) =>

                  normalizeText(
                    value
                  ).includes(
                    normalizedQuery
                  )

              );


            const matchesStatus =

              statusFilter ===
              "All"

              ||

              String(

                order?.status ||

                "Placed"

              )

                .toLowerCase()

                .trim()

                ===

              statusFilter

                .toLowerCase()

                .trim();


            return (

              matchesSearch &&

              matchesStatus

            );

          }

        );

      },

      [

        orders,

        searchTerm,

        statusFilter,

      ]

    );


  // ==========================================================
  // ORDER GROUPS
  // ==========================================================

  const activeOrders =

    filteredOrders.filter(

      (
        order
      ) => {

        const status =

          String(

            order?.status ||

            "Placed"

          )

            .toLowerCase()

            .trim();


        return (

          status !==
          "delivered"

          &&

          status !==
          "cancelled"

        );

      }

    );


  const deliveredOrders =

    filteredOrders.filter(

      (
        order
      ) =>

        String(

          order?.status ||

          ""

        )

          .toLowerCase()

          .trim()

          ===

        "delivered"

    );


  const cancelledOrders =

    filteredOrders.filter(

      (
        order
      ) =>

        String(

          order?.status ||

          ""

        )

          .toLowerCase()

          .trim()

          ===

        "cancelled"

    );


  // ==========================================================
  // ANALYTICS
  // ==========================================================

  const totalOrders =
    orders.length;


  const pendingOrders =

    orders.filter(

      (
        order
      ) => {

        const status =

          String(

            order?.status ||

            "Placed"

          )

            .toLowerCase()

            .trim();


        return (

          status ===
          "placed"

          ||

          status ===
          "processing"

        );

      }

    ).length;


  const deliveredCount =

    orders.filter(

      (
        order
      ) =>

        String(

          order?.status ||

          ""

        )

          .toLowerCase()

          .trim()

          ===

        "delivered"

    ).length;


  const totalRevenue =

    orders

      .filter(

        (
          order
        ) =>

          String(

            order?.status ||

            ""

          )

            .toLowerCase()

            .trim()

            !==

          "cancelled"

      )

      .reduce(

        (
          total,
          order
        ) =>

          total +

          Number(
            order?.amount ||
            0
          ),

        0

      );


  const hasActiveFilters =

    Boolean(
      searchTerm.trim()
    )

    ||

    statusFilter !==
    "All";


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#FAF7F1]
      "
      style={{
        fontFamily:
          "'Inter', sans-serif",
      }}
    >

      <Nav />


      <Toast
        toast={
          toast
        }
      />


      <div
        className="
          md:hidden
        "
      >

        <Sidebar />

      </div>


      <div
        className="
          flex
          min-h-[calc(100vh-80px)]
          w-full
        "
      >

        <aside
          className="
            hidden
            shrink-0
            md:block
          "
        >

          <Sidebar />

        </aside>


        <main
          className="
            min-w-0
            flex-1
            p-4
            sm:p-6
            lg:p-8
            xl:p-10
          "
        >

          <div
            className="
              mx-auto
              w-full
              max-w-[1700px]
            "
          >


            {/* HEADER */}

            <div
              className="
                mb-8
                flex
                flex-col
                gap-5
                xl:flex-row
                xl:items-end
                xl:justify-between
              "
            >

              <div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#FF6A3D]/10
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-[#FF6A3D]
                  "
                >

                  <Package
                    size={14}
                  />

                  ORDER MANAGEMENT

                </div>


                <h1
                  className="
                    mt-3
                    text-3xl
                    font-bold
                    tracking-tight
                    text-[#14172E]
                    sm:text-4xl
                    lg:text-5xl
                  "
                >

                  Customer

                  {" "}

                  <span
                    className="
                      text-[#FF6A3D]
                    "
                  >
                    Orders
                  </span>

                </h1>


                <p
                  className="
                    mt-3
                    max-w-2xl
                    text-sm
                    leading-6
                    text-[#8A8578]
                    sm:text-base
                  "
                >

                  Track customer purchases,
                  update order status,
                  and manage deliveries
                  from one dashboard.

                </p>

              </div>


              <button

                type="button"

                onClick={
                  handleRefresh
                }

                disabled={
                  refreshing
                }

                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[#14172E]
                  px-5
                  py-3.5
                  text-sm
                  font-bold
                  text-white
                  transition-colors
                  hover:bg-[#FF6A3D]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:w-auto
                "

              >

                <RefreshCw

                  size={18}

                  className={

                    refreshing

                      ? "animate-spin"

                      : ""

                  }

                />

                {

                  refreshing

                    ? "Refreshing..."

                    : "Refresh Orders"

                }

              </button>

            </div>


            {/* ANALYTICS */}

            <div
              className="
                mb-8
                grid
                grid-cols-2
                gap-3
                sm:gap-4
                xl:grid-cols-4
              "
            >

              <AnalyticsCard

                title="Total Orders"

                value={
                  totalOrders
                }

                icon={
                  ShoppingBag
                }

                iconClass="
                  bg-[#FF6A3D]/10
                  text-[#FF6A3D]
                "

                delay={
                  0
                }

              />


              <AnalyticsCard

                title="Pending"

                value={
                  pendingOrders
                }

                icon={
                  Clock3
                }

                iconClass="
                  bg-amber-50
                  text-amber-600
                "

                delay={
                  0.05
                }

              />


              <AnalyticsCard

                title="Delivered"

                value={
                  deliveredCount
                }

                icon={
                  CheckCircle2
                }

                iconClass="
                  bg-emerald-50
                  text-emerald-600
                "

                delay={
                  0.1
                }

              />


              <AnalyticsCard

                title="Revenue"

                value={
                  formatPrice(
                    totalRevenue
                  )
                }

                icon={
                  IndianRupee
                }

                iconClass="
                  bg-[#3B4CE0]/10
                  text-[#3B4CE0]
                "

                delay={
                  0.15
                }

              />

            </div>


            {/* SEARCH + FILTER */}

            <div
              className="
                mb-8
                rounded-3xl
                border
                border-[#F0E9DE]
                bg-white
                p-4
                shadow-sm
                sm:p-5
              "
            >

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  lg:flex-row
                  lg:items-center
                "
              >

                {/* SEARCH */}

                <div
                  className="
                    relative
                    min-w-0
                    flex-1
                  "
                >

                  <Search

                    size={19}

                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#B4AFA1]
                    "

                  />

                  <input

                    type="search"

                    value={
                      searchTerm
                    }

                    onChange={(
                      event
                    ) => {

                      setSearchTerm(
                        event.target.value
                      );

                    }}

                    placeholder="Search order ID, customer or phone"

                    aria-label="
                      Search orders
                    "

                    className="
                      w-full
                      rounded-2xl
                      border
                      border-[#E5DDD1]
                      bg-[#FFFDFB]
                      py-3.5
                      pl-12
                      pr-11
                      text-sm
                      font-medium
                      text-[#14172E]
                      outline-none
                      transition-all
                      placeholder:text-[#AAA397]
                      focus:border-[#FF6A3D]
                      focus:ring-4
                      focus:ring-[#FF6A3D]/10
                    "

                  />

                  {

                    searchTerm && (

                      <button

                        type="button"

                        onClick={
                          () =>

                            setSearchTerm(
                              ""
                            )
                        }

                        className="
                          absolute
                          right-3
                          top-1/2
                          flex
                          h-8
                          w-8
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          text-[#8A8578]
                          transition-colors
                          hover:bg-[#FFE7DB]
                          hover:text-[#FF6A3D]
                        "

                        aria-label="
                          Clear search
                        "

                      >

                        <X
                          size={17}
                        />

                      </button>

                    )

                  }

                </div>


                {/* STATUS */}

                <div
                  className="
                    relative
                    w-full
                    lg:w-[245px]
                  "
                >

                  <select

                    value={
                      statusFilter
                    }

                    onChange={(
                      event
                    ) => {

                      setStatusFilter(
                        event.target.value
                      );

                    }}

                    className="
                      w-full
                      cursor-pointer
                      appearance-none
                      rounded-2xl
                      border
                      border-[#E5DDD1]
                      bg-[#FFFDFB]
                      px-4
                      py-3.5
                      pr-12
                      text-sm
                      font-bold
                      text-[#50546B]
                      outline-none
                      transition-all
                      focus:border-[#FF6A3D]
                      focus:ring-4
                      focus:ring-[#FF6A3D]/10
                    "

                  >

                    <option
                      value="All"
                    >
                      All statuses
                    </option>

                    {

                      ORDER_STATUSES.map(

                        (
                          status
                        ) => (

                          <option

                            key={
                              status
                            }

                            value={
                              status
                            }

                          >

                            {status}

                          </option>

                        )

                      )

                    }

                  </select>

                  <ChevronDown

                    size={18}

                    className="
                      pointer-events-none
                      absolute
                      right-4
                      top-1/2
                      -translate-y-1/2
                      text-[#8A8578]
                    "

                  />

                </div>


                {/* CLEAR ALL */}

                {

                  hasActiveFilters && (

                    <button

                      type="button"

                      onClick={
                        clearFilters
                      }

                      className="
                        w-full
                        shrink-0
                        rounded-2xl
                        border
                        border-[#E5DDD1]
                        bg-white
                        px-5
                        py-3.5
                        text-sm
                        font-bold
                        text-[#50546B]
                        transition-all
                        hover:border-[#FF6A3D]
                        hover:bg-[#FFF4EE]
                        hover:text-[#FF6A3D]
                        lg:w-auto
                      "

                    >

                      Clear all

                    </button>

                  )

                }

              </div>


              <div
                className="
                  mt-4
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-3
                  border-t
                  border-[#F5F0E8]
                  pt-4
                "
              >

                <p
                  className="
                    text-xs
                    font-medium
                    text-[#8A8578]
                  "
                >

                  Showing

                  {" "}

                  <span
                    className="
                      font-bold
                      text-[#14172E]
                    "
                  >

                    {
                      filteredOrders.length
                    }

                  </span>

                  {" "}

                  of

                  {" "}

                  <span
                    className="
                      font-bold
                      text-[#14172E]
                    "
                  >

                    {
                      orders.length
                    }

                  </span>

                  {" "}

                  orders

                </p>


                {

                  statusFilter !==
                  "All"

                  && (

                    <span
                      className="
                        rounded-full
                        bg-[#FF6A3D]/10
                        px-3
                        py-1.5
                        text-[11px]
                        font-bold
                        text-[#FF6A3D]
                      "
                    >

                      {
                        statusFilter
                      }

                    </span>

                  )

                }

              </div>

            </div>


            {/* CONTENT */}

            {

              loading

                ? (

                  <div
                    className="
                      space-y-4
                    "
                  >

                    {

                      Array

                        .from({
                          length: 5,
                        })

                        .map(

                          (
                            _,
                            index
                          ) => (

                            <div

                              key={
                                index
                              }

                              className="
                                h-36
                                animate-pulse
                                rounded-3xl
                                bg-white
                              "

                            />

                          )

                        )

                    }

                  </div>

                )

                : (

                  <>

                    {

                      filteredOrders.length ===
                      0

                        ? (

                          <div
                            className="
                              rounded-3xl
                              border
                              border-dashed
                              border-[#E5DDD1]
                              bg-white
                              px-5
                              py-16
                              text-center
                            "
                          >

                            <Search
                              size={40}
                              className="
                                mx-auto
                                text-[#B4AFA1]
                              "
                            />

                            <h3
                              className="
                                mt-5
                                text-lg
                                font-bold
                                text-[#14172E]
                              "
                            >
                              No matching orders
                            </h3>

                            <p
                              className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-[#8A8578]
                              "
                            >
                              Try a different order ID,
                              customer name,
                              phone number,
                              or status.
                            </p>

                            {

                              hasActiveFilters && (

                                <button

                                  type="button"

                                  onClick={
                                    clearFilters
                                  }

                                  className="
                                    mt-5
                                    rounded-xl
                                    bg-[#14172E]
                                    px-5
                                    py-3
                                    text-sm
                                    font-bold
                                    text-white
                                    transition-colors
                                    hover:bg-[#FF6A3D]
                                  "

                                >

                                  Clear filters

                                </button>

                              )

                            }

                          </div>

                        )

                        : (

                          <>

                            <OrderSection

                              title="Active Orders"

                              description="
                                Orders currently being processed,
                                shipped, or delivered.
                              "

                              icon={
                                ClipboardList
                              }

                              iconClass="
                                text-[#FF6A3D]
                              "

                              countClass="
                                bg-[#FF6A3D]/10
                                text-[#FF6A3D]
                              "

                              orders={
                                activeOrders
                              }

                              emptyText="
                                No active orders found.
                              "

                              emptyIcon={
                                PackageX
                              }

                              updatingId={
                                updatingId
                              }

                              onStatusChange={
                                handleStatusChange
                              }

                              onView={
                                setSelectedOrder
                              }

                            />


                            <section
                              className="
                                mt-12
                              "
                            >

                              <OrderSection

                                title="Delivered Orders"

                                description="
                                  Successfully completed
                                  customer orders.
                                "

                                icon={
                                  PackageCheck
                                }

                                iconClass="
                                  text-emerald-600
                                "

                                countClass="
                                  bg-emerald-50
                                  text-emerald-700
                                "

                                orders={
                                  deliveredOrders
                                }

                                emptyText="
                                  No delivered orders found.
                                "

                                emptyIcon={
                                  CheckCircle2
                                }

                                updatingId={
                                  updatingId
                                }

                                onStatusChange={
                                  handleStatusChange
                                }

                                onView={
                                  setSelectedOrder
                                }

                              />

                            </section>


                            <section
                              className="
                                mt-12
                                pb-8
                              "
                            >

                              <OrderSection

                                title="Cancelled Orders"

                                description="
                                  Orders that were cancelled
                                  before completion.
                                "

                                icon={
                                  XCircle
                                }

                                iconClass="
                                  text-red-500
                                "

                                countClass="
                                  bg-red-50
                                  text-red-600
                                "

                                orders={
                                  cancelledOrders
                                }

                                emptyText="
                                  No cancelled orders found.
                                "

                                emptyIcon={
                                  XCircle
                                }

                                updatingId={
                                  updatingId
                                }

                                onStatusChange={
                                  handleStatusChange
                                }

                                onView={
                                  setSelectedOrder
                                }

                              />

                            </section>

                          </>

                        )

                    }

                  </>

                )

            }

          </div>

        </main>

      </div>


      <AnimatePresence>

        {

          selectedOrder && (

            <OrderDetailsModal

              order={
                selectedOrder
              }

              onClose={
                () =>

                  setSelectedOrder(
                    null
                  )
              }

            />

          )

        }

      </AnimatePresence>

    </div>

  );

}


export default Orders;