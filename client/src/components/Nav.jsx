import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import axios from "axios";

import {
  Info,
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  UserPlus,
  X,
} from "lucide-react";

import {
  authDataContext,
} from "../context/Authcontext";

import {
  userDataContext,
} from "../context/UserContext";

import {
  shopDataContext,
} from "../context/ShopContext";


const NAV_LINKS = [

  {
    label: "Home",
    href: "/",
  },

  {
    label: "Collections",
    href: "/collections",
  },

  {
    label: "About",
    href: "/about",
  },

  {
    label: "Contact",
    href: "/contact",
  },

];


export default function Nav() {


  // ==========================================
  // STATES
  // ==========================================

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);


  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);


  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");


  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  const [
    selectedSuggestionIndex,
    setSelectedSuggestionIndex,
  ] = useState(-1);


  // ==========================================
  // CONTEXT
  // ==========================================

  const navigate =
    useNavigate();


  const {
    serverUrl,
  } = useContext(
    authDataContext
  );


  const {
    userData,
    setUserData,
  } = useContext(
    userDataContext
  );


  const shopContext =
    useContext(
      shopDataContext
    );


  const {
    products = [],

    setSearch,

    getCartCount,

  } = shopContext || {};


  // ==========================================
  // REFS
  // ==========================================

  const profileRef =
    useRef(null);


  const searchInputRef =
    useRef(null);


  // ==========================================
  // LIVE CART COUNT
  // ==========================================

  const cartCount =

    typeof getCartCount ===
    "function"

      ? getCartCount()

      : 0;


  // ==========================================
  // SEARCH SUGGESTIONS
  // ==========================================

  const suggestions =

    useMemo(
      () => {

        const query =

          searchQuery
            .trim()
            .toLowerCase();


        if (

          !query ||

          !products.length

        ) {

          return [];

        }


        return products

          .filter(

            (product) => {

              const name =

                (
                  product.name ||
                  ""
                )
                .toLowerCase();


              const category =

                (
                  product.category ||
                  ""
                )
                .toLowerCase();


              const subCategory =

                (
                  product.subCategory ||
                  ""
                )
                .toLowerCase();


              return (

                name.includes(
                  query
                ) ||

                category.includes(
                  query
                ) ||

                subCategory.includes(
                  query
                )

              );

            }

          )

          .slice(
            0,
            8
          );

      },

      [

        searchQuery,

        products,

      ]

    );


  // ==========================================
  // CLOSE SEARCH
  // ==========================================

  const closeSearch =
    () => {

      setSearchOpen(
        false
      );


      setSearchQuery(
        ""
      );


      setSelectedSuggestionIndex(
        -1
      );

    };


  // ==========================================
  // SUBMIT SEARCH
  // ==========================================

  const submitSearch =
    (
      searchTerm
    ) => {


      const term =

        (
          searchTerm ||
          searchQuery
        )
        .trim();


      if (
        !term
      ) {

        return;

      }


      if (

        typeof setSearch ===
        "function"

      ) {

        setSearch(
          term
        );

      }


      navigate(
        "/collections"
      );


      setSearchOpen(
        false
      );


      setMobileMenuOpen(
        false
      );


      setSelectedSuggestionIndex(
        -1
      );

    };


  // ==========================================
  // SEARCH KEYBOARD
  // ==========================================

  const handleSearchKeyDown =
    (
      event
    ) => {


      if (

        event.key ===
        "Escape"

      ) {

        closeSearch();

        return;

      }


      if (

        event.key ===
        "Enter"

      ) {

        event.preventDefault();


        if (

          selectedSuggestionIndex >=
          0 &&

          suggestions[
            selectedSuggestionIndex
          ]

        ) {

          const selectedProduct =

            suggestions[
              selectedSuggestionIndex
            ];


          submitSearch(

            selectedProduct.name

          );

        } else {

          submitSearch();

        }


        return;

      }


      if (

        !suggestions.length

      ) {

        return;

      }


      if (

        event.key ===
        "ArrowDown"

      ) {

        event.preventDefault();


        setSelectedSuggestionIndex(

          (
            previous
          ) =>

            previous <

            suggestions.length -
            1

              ? previous + 1

              : previous

        );

      }


      if (

        event.key ===
        "ArrowUp"

      ) {

        event.preventDefault();


        setSelectedSuggestionIndex(

          (
            previous
          ) =>

            previous > 0

              ? previous - 1

              : -1

        );

      }

    };


  // ==========================================
  // SEARCH BUTTON
  // ==========================================

  const handleSearchButton =
    () => {


      if (
        !searchOpen
      ) {

        setSearchOpen(
          true
        );


        setTimeout(
          () => {

            searchInputRef
              .current
              ?.focus();

          },
          100
        );


        return;

      }


      if (

        searchQuery
          .trim()

      ) {

        submitSearch();

      } else {

        closeSearch();

      }

    };


  // ==========================================
  // CLICK OUTSIDE PROFILE
  // ==========================================

  useEffect(
    () => {


      const handleClickOutside =

        (
          event
        ) => {


          if (

            profileRef.current &&

            !profileRef
              .current
              .contains(
                event.target
              )

          ) {

            setProfileOpen(
              false
            );

          }

        };


      document.addEventListener(

        "mousedown",

        handleClickOutside

      );


      return () => {

        document.removeEventListener(

          "mousedown",

          handleClickOutside

        );

      };

    },

    []

  );


  // ==========================================
  // ESCAPE KEY
  // ==========================================

  useEffect(
    () => {


      const handleEscape =

        (
          event
        ) => {


          if (

            event.key ===
            "Escape"

          ) {

            setProfileOpen(
              false
            );


            closeSearch();

          }

        };


      document.addEventListener(

        "keydown",

        handleEscape

      );


      return () => {

        document.removeEventListener(

          "keydown",

          handleEscape

        );

      };

    },

    []

  );


  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNavigate =
    (
      path
    ) => {


      navigate(
        path
      );


      setProfileOpen(
        false
      );


      setMobileMenuOpen(
        false
      );

    };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout =
    async () => {


      try {

        await axios.post(

          `${serverUrl}/api/auth/logout`,

          {},

          {

            withCredentials:
              true,

          }

        );


        setUserData(
          null
        );


        setProfileOpen(
          false
        );


        navigate(
          "/"
        );

      } catch (
        error
      ) {

        console.error(

          "Logout failed:",

          error.response
            ?.data ||

          error.message

        );

      }

    };


  // ==========================================
  // OPEN CART
  // ==========================================

  const handleCartClick =
    () => {


      if (
        !userData
      ) {

        navigate(

          "/login",

          {

            state: {

              from:
                "/cart",

            },

          }

        );


        return;

      }


      navigate(
        "/cart"
      );

    };


  // ==========================================
  // JSX
  // ==========================================

  return (

    <header

      className="
      sticky
      top-0
      z-50
      w-full
      border-b
      border-[#F2E6DC]
      bg-[#FFFBF7]/95
      backdrop-blur-md
      "

    >

      <div

        className="
        w-full
        px-4
        sm:px-6
        lg:px-10
        xl:px-16
        "

      >


        {/* ================================= */}
        {/* MAIN NAVIGATION */}
        {/* ================================= */}

        <div

          className="
          flex
          h-16
          items-center
          justify-between
          gap-2

          sm:h-20

          lg:h-24
          "

        >


          {/* LOGO */}

          <button

            onClick={
              () =>
                handleNavigate(
                  "/"
                )
            }

            className="
            flex
            min-w-0
            shrink-0
            items-center
            gap-1.5

            sm:gap-2.5
            "

          >

            <img

              src="/paws.png"

              alt="FurEver"

              className="
              h-8
              w-8
              shrink-0
              object-contain

              sm:h-11
              sm:w-11

              lg:h-14
              lg:w-14

              xl:h-16
              xl:w-16
              "

            />


            <span

              className="
              whitespace-nowrap
              text-xl
              tracking-tight
              text-[#181D27]

              sm:text-2xl

              lg:text-3xl

              xl:text-4xl
              "

              style={{

                fontFamily:

                  "'Baloo 2', sans-serif",

                fontWeight:
                  700,

              }}

            >

              Fur

              <span

                className="
                text-[#FF5C35]
                "

              >

                Ever

              </span>

            </span>

          </button>


          {/* DESKTOP LINKS */}

          <nav

            className="
            hidden

            lg:flex
            lg:items-center
            lg:gap-10

            xl:gap-14
            "

          >

            {

              NAV_LINKS.map(

                (
                  link
                ) => (

                  <button

                    key={
                      link.label
                    }

                    onClick={
                      () =>
                        handleNavigate(
                          link.href
                        )
                    }

                    className="
                    relative
                    text-lg
                    font-semibold
                    text-[#181D27]
                    transition-colors

                    hover:text-[#FF5C35]

                    after:absolute
                    after:left-0
                    after:-bottom-1.5
                    after:h-[2px]
                    after:w-0
                    after:bg-[#FF5C35]
                    after:transition-all

                    hover:after:w-full

                    xl:text-xl
                    "

                  >

                    {
                      link.label
                    }

                  </button>

                )

              )

            }

          </nav>


          {/* RIGHT SIDE */}

          <div

            className="
            flex
            shrink-0
            items-center
            gap-1

            sm:gap-3

            lg:gap-4
            "

          >


            {/* DESKTOP SEARCH */}

            <div

              className="
              relative
              hidden

              sm:block
              "

            >

              <div

                className="
                flex
                items-center
                "

              >


                <AnimatePresence>

                  {

                    searchOpen && (

                      <motion.div

                        initial={{

                          width:
                            0,

                          opacity:
                            0,

                        }}

                        animate={{

                          width:
                            280,

                          opacity:
                            1,

                        }}

                        exit={{

                          width:
                            0,

                          opacity:
                            0,

                        }}

                        transition={{

                          duration:
                            0.25,

                        }}

                        className="
                        overflow-hidden
                        "

                      >

                        <input

                          ref={
                            searchInputRef
                          }

                          type="text"

                          value={
                            searchQuery
                          }

                          onChange={

                            (
                              event
                            ) => {

                              setSearchQuery(

                                event
                                  .target
                                  .value

                              );


                              setSelectedSuggestionIndex(

                                -1

                              );

                            }

                          }

                          onKeyDown={
                            handleSearchKeyDown
                          }

                          placeholder="
                          Search products...
                          "

                          className="
                          w-full
                          rounded-full
                          border
                          border-[#F2E6DC]
                          bg-[#FFF8F1]
                          px-4
                          py-2.5
                          text-base
                          text-[#181D27]
                          outline-none

                          placeholder:text-[#B7AFA3]

                          focus:border-[#FF5C35]

                          focus:ring-2
                          focus:ring-[#FF5C35]/15
                          "

                        />

                      </motion.div>

                    )

                  }

                </AnimatePresence>


                <button

                  onClick={
                    handleSearchButton
                  }

                  className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-[#181D27]
                  transition-colors

                  hover:bg-[#FFF1EA]

                  hover:text-[#FF5C35]

                  lg:h-11
                  lg:w-11
                  "

                >

                  {

                    searchOpen &&

                    !searchQuery
                      .trim()

                      ? (

                        <X
                          size={22}
                        />

                      )

                      : (

                        <Search
                          size={22}
                        />

                      )

                  }

                </button>

              </div>


              {/* SEARCH SUGGESTIONS */}

              <AnimatePresence>

                {

                  searchOpen &&

                  suggestions.length >
                  0 && (

                    <motion.div

                      initial={{

                        opacity:
                          0,

                        y:
                          -8,

                      }}

                      animate={{

                        opacity:
                          1,

                        y:
                          0,

                      }}

                      exit={{

                        opacity:
                          0,

                        y:
                          -8,

                      }}

                      className="
                      absolute
                      right-0
                      top-full
                      z-[70]
                      mt-2
                      max-h-[320px]
                      w-[320px]
                      overflow-y-auto
                      rounded-2xl
                      border
                      border-[#E3D9CB]
                      bg-white
                      shadow-xl
                      "

                    >

                      {

                        suggestions.map(

                          (
                            product,
                            index
                          ) => (

                            <button

                              key={
                                product._id
                              }

                              onClick={
                                () =>
                                  submitSearch(

                                    product.name

                                  )
                              }

                              onMouseEnter={
                                () =>

                                  setSelectedSuggestionIndex(

                                    index

                                  )
                              }

                              className={`

                              flex
                              w-full
                              items-center
                              gap-3
                              border-b
                              border-[#F2E6DC]
                              px-4
                              py-3
                              text-left

                              last:border-none

                              hover:bg-[#FFF8F1]

                              ${

                                selectedSuggestionIndex ===

                                index

                                  ? "bg-[#FFF8F1]"

                                  : ""

                              }

                              `}

                            >

                              <img

                                src={
                                  product.image1
                                }

                                alt={
                                  product.name
                                }

                                className="
                                h-11
                                w-11
                                rounded-lg
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
                                  font-semibold
                                  text-[#181D27]
                                  "

                                >

                                  {
                                    product.name
                                  }

                                </p>


                                <p

                                  className="
                                  text-xs
                                  text-[#8A8578]
                                  "

                                >

                                  ₹
                                  {
                                    product.price
                                  }

                                </p>

                              </div>

                            </button>

                          )

                        )

                      }

                    </motion.div>

                  )

                }

              </AnimatePresence>

            </div>


            {/* PROFILE */}

            <div

              ref={
                profileRef
              }

              className="
              relative
              "

            >

              <button

                onClick={
                  () =>

                    setProfileOpen(

                      (
                        open
                      ) =>

                        !open

                    )
                }

                className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                transition-colors

                sm:h-10
                sm:w-10

                lg:h-11
                lg:w-11
                "

              >

                {

                  userData

                    ? (

                      <span

                        className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FF5C35]
                        text-base
                        font-bold
                        text-white

                        sm:text-lg
                        "

                      >

                        {

                          userData
                            ?.name
                            ?.[0]
                            ?.toUpperCase()

                        }

                      </span>

                    )

                    : (

                      <User

                        size={20}

                        className="
                        text-[#181D27]
                        "

                      />

                    )

                }

              </button>


              <AnimatePresence>

                {

                  profileOpen && (

                    <motion.div

                      initial={{

                        opacity:
                          0,

                        y:
                          -8,

                        scale:
                          0.97,

                      }}

                      animate={{

                        opacity:
                          1,

                        y:
                          0,

                        scale:
                          1,

                      }}

                      exit={{

                        opacity:
                          0,

                        y:
                          -8,

                        scale:
                          0.97,

                      }}

                      className="
                      absolute
                      right-0
                      z-[80]
                      mt-3
                      w-56
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#F2E6DC]
                      bg-white
                      shadow-xl
                      "

                    >

                      {

                        userData

                          ? (

                            <>

                              <div

                                className="
                                border-b
                                border-[#F2E6DC]
                                px-4
                                py-4
                                "

                              >

                                <p

                                  className="
                                  font-semibold
                                  text-[#181D27]
                                  "

                                >

                                  {
                                    userData.name
                                  }

                                </p>


                                <p

                                  className="
                                  truncate
                                  text-sm
                                  text-[#8A8378]
                                  "

                                >

                                  {
                                    userData.email
                                  }

                                </p>

                              </div>


                              <div

                                className="
                                py-2
                                "

                              >

                                <button

                                  onClick={
                                    () =>

                                      handleNavigate(

                                        "/orders"

                                      )
                                  }

                                  className="
                                  flex
                                  w-full
                                  items-center
                                  gap-3
                                  px-4
                                  py-3
                                  text-left
                                  font-medium
                                  text-[#181D27]

                                  hover:bg-[#FFF1EA]

                                  hover:text-[#FF5C35]
                                  "

                                >

                                  <Package
                                    size={18}
                                  />

                                  Orders

                                </button>


                                <button

                                  onClick={
                                    () =>

                                      handleNavigate(

                                        "/about"

                                      )
                                  }

                                  className="
                                  flex
                                  w-full
                                  items-center
                                  gap-3
                                  px-4
                                  py-3
                                  text-left
                                  font-medium
                                  text-[#181D27]

                                  hover:bg-[#FFF1EA]

                                  hover:text-[#FF5C35]
                                  "

                                >

                                  <Info
                                    size={18}
                                  />

                                  About

                                </button>


                                <div

                                  className="
                                  my-1
                                  h-px
                                  bg-[#F2E6DC]
                                  "

                                />


                                <button

                                  onClick={
                                    handleLogout
                                  }

                                  className="
                                  flex
                                  w-full
                                  items-center
                                  gap-3
                                  px-4
                                  py-3
                                  text-left
                                  font-medium
                                  text-[#FF6A4A]

                                  hover:bg-[#FFF3F0]
                                  "

                                >

                                  <LogOut
                                    size={18}
                                  />

                                  Logout

                                </button>

                              </div>

                            </>

                          )

                          : (

                            <div

                              className="
                              py-2
                              "

                            >

                              <button

                                onClick={
                                  () =>

                                    handleNavigate(

                                      "/login"

                                    )
                                }

                                className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-4
                                py-3
                                font-medium
                                text-[#181D27]

                                hover:bg-[#FFF1EA]

                                hover:text-[#FF5C35]
                                "

                              >

                                <LogIn
                                  size={18}
                                />

                                Login

                              </button>


                              <button

                                onClick={
                                  () =>

                                    handleNavigate(

                                      "/signup"

                                    )
                                }

                                className="
                                flex
                                w-full
                                items-center
                                gap-3
                                px-4
                                py-3
                                font-medium
                                text-[#181D27]

                                hover:bg-[#FFF1EA]

                                hover:text-[#FF5C35]
                                "

                              >

                                <UserPlus
                                  size={18}
                                />

                                Sign Up

                              </button>

                            </div>

                          )

                      }

                    </motion.div>

                  )

                }

              </AnimatePresence>

            </div>


            {/* CART */}

            <button

              onClick={
                handleCartClick
              }

              aria-label="
              Open cart
              "

              className="
              relative
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              text-[#181D27]
              transition-colors

              hover:bg-[#FFF1EA]

              hover:text-[#FF5C35]

              sm:h-10
              sm:w-10

              lg:h-11
              lg:w-11
              "

            >

              <ShoppingCart

                size={20}

                className="
                sm:h-[22px]
                sm:w-[22px]
                "

              />


              {

                cartCount > 0 && (

                  <motion.span

                    initial={{

                      scale:
                        0,

                    }}

                    animate={{

                      scale:
                        1,

                    }}

                    key={
                      cartCount
                    }

                    className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-[19px]
                    min-w-[19px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FF5C35]
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                    "

                  >

                    {

                      cartCount > 99

                        ? "99+"

                        : cartCount

                    }

                  </motion.span>

                )

              }

            </button>


            {/* MOBILE SEARCH */}

            <button

              onClick={
                () =>

                  setSearchOpen(

                    (
                      open
                    ) =>

                      !open

                  )
              }

              className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[#181D27]

              hover:bg-[#FFF1EA]

              hover:text-[#FF5C35]

              sm:hidden
              "

            >

              <Search
                size={20}
              />

            </button>


            {/* MOBILE MENU */}

            <button

              onClick={
                () =>

                  setMobileMenuOpen(

                    (
                      open
                    ) =>

                      !open

                  )
              }

              className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-[#181D27]

              hover:bg-[#FFF1EA]

              hover:text-[#FF5C35]

              lg:hidden
              "

            >

              {

                mobileMenuOpen

                  ? (

                    <X
                      size={22}
                    />

                  )

                  : (

                    <Menu
                      size={22}
                    />

                  )

              }

            </button>

          </div>

        </div>


        {/* ================================= */}
        {/* MOBILE SEARCH */}
        {/* ================================= */}

        <AnimatePresence>

          {

            searchOpen && (

              <motion.div

                initial={{

                  height:
                    0,

                  opacity:
                    0,

                }}

                animate={{

                  height:
                    "auto",

                  opacity:
                    1,

                }}

                exit={{

                  height:
                    0,

                  opacity:
                    0,

                }}

                className="
                overflow-hidden

                sm:hidden
                "

              >

                <div

                  className="
                  pb-4
                  "

                >

                  <input

                    autoFocus

                    type="text"

                    value={
                      searchQuery
                    }

                    onChange={

                      (
                        event
                      ) => {

                        setSearchQuery(

                          event
                            .target
                            .value

                        );

                      }

                    }

                    onKeyDown={
                      handleSearchKeyDown
                    }

                    placeholder="
                    Search products...
                    "

                    className="
                    w-full
                    rounded-full
                    border
                    border-[#F2E6DC]
                    bg-[#FFF8F1]
                    px-4
                    py-3
                    text-[#181D27]
                    outline-none

                    focus:border-[#FF5C35]
                    "

                  />

                </div>

              </motion.div>

            )

          }

        </AnimatePresence>


        {/* ================================= */}
        {/* MOBILE MENU */}
        {/* ================================= */}

        <AnimatePresence>

          {

            mobileMenuOpen && (

              <motion.nav

                initial={{

                  height:
                    0,

                  opacity:
                    0,

                }}

                animate={{

                  height:
                    "auto",

                  opacity:
                    1,

                }}

                exit={{

                  height:
                    0,

                  opacity:
                    0,

                }}

                className="
                overflow-hidden
                border-t
                border-[#F2E6DC]

                lg:hidden
                "

              >

                <div

                  className="
                  flex
                  flex-col
                  gap-1
                  py-4
                  "

                >

                  {

                    NAV_LINKS.map(

                      (
                        link
                      ) => (

                        <button

                          key={
                            link.label
                          }

                          onClick={
                            () =>

                              handleNavigate(

                                link.href

                              )
                          }

                          className="
                          rounded-xl
                          px-3
                          py-3
                          text-left
                          text-lg
                          font-semibold
                          text-[#181D27]

                          hover:bg-[#FFF1EA]

                          hover:text-[#FF5C35]
                          "

                        >

                          {
                            link.label
                          }

                        </button>

                      )

                    )

                  }

                </div>

              </motion.nav>

            )

          }

        </AnimatePresence>

      </div>

    </header>

  );

}