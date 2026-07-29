import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import axios from "axios";

import {
  FaStar,
  FaShoppingBag,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
} from "react-icons/fa";

import {
  FiHeart,
  FiArrowLeft,
} from "react-icons/fi";

import { shopDataContext } from "../context/ShopContext";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/Authcontext.jsx";

import Nav from "../components/Nav.jsx";


function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    products,
    currency,
    addToCart,
    getCartCount,
  } = useContext(shopDataContext);

  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [product, setProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [wishlist, setWishlist] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [message, setMessage] = useState("");


  // ---------------- SCROLL TO TOP ----------------

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);


  // ---------------- FIND PRODUCT ----------------

  useEffect(() => {
    const foundProduct = products.find(
      (item) => item._id === id
    );

    setProduct(foundProduct || null);

    setSelectedImage(0);
    setSelectedSize("");
    setQuantity(1);
  }, [products, id]);


  // ---------------- FETCH REVIEWS ----------------

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);

        const response = await axios.get(
          `${serverUrl}/api/product/${id}/reviews`
        );

        if (response.data.success) {
          setProduct((previousProduct) => {
            if (!previousProduct) {
              return previousProduct;
            }

            return {
              ...previousProduct,
              reviews: response.data.reviews,
              rating: response.data.rating,
              reviewCount: response.data.reviewCount,
            };
          });
        }
      } catch (error) {
        console.log("Fetch Reviews Error:", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id && serverUrl) {
      fetchReviews();
    }
  }, [id, serverUrl]);


  // ---------------- PRODUCT IMAGES ----------------

  const productImages = useMemo(() => {
    if (!product) {
      return [];
    }

    return [
      product.image1,
      product.image2,
      product.image3,
      product.image4,
    ].filter(Boolean);
  }, [product]);


  // ---------------- RELATED PRODUCTS ----------------

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter(
        (item) =>
          item._id !== product._id &&
          (
            item.category === product.category ||
            item.subCategory === product.subCategory
          )
      )
      .slice(0, 4);
  }, [products, product]);


  // ---------------- RATING ----------------

  const averageRating =
    product?.rating && product.rating > 0
      ? Number(product.rating)
      : 0;


  // ---------------- ADD TO CART ----------------

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (
      product.sizes?.length > 0 &&
      !selectedSize
    ) {
      setMessage("Please select a size first.");
      return;
    }

    addToCart(
      product._id,
      selectedSize,
      quantity
    );

    setMessage("Product added to cart successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };


  // ---------------- BUY NOW ----------------

  const handleBuyNow = () => {
    if (!product) {
      return;
    }

    if (
      product.sizes?.length > 0 &&
      !selectedSize
    ) {
      setMessage("Please select a size first.");
      return;
    }

    addToCart(
      product._id,
      selectedSize,
      quantity
    );

    navigate("/cart");
  };


  // ---------------- SUBMIT REVIEW ----------------

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });

      return;
    }

    if (reviewRating === 0) {
      setMessage("Please select a rating.");
      return;
    }

    if (!reviewText.trim()) {
      setMessage("Please write a review.");
      return;
    }

    try {
      setReviewLoading(true);

      const response = await axios.post(
        `${serverUrl}/api/product/${product._id}/review`,
        {
          rating: reviewRating,
          comment: reviewText.trim(),
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessage(
          "Thank you for sharing your experience!"
        );

        setReviewRating(0);
        setReviewText("");

        const updatedReviews = await axios.get(
          `${serverUrl}/api/product/${product._id}/reviews`
        );

        if (updatedReviews.data.success) {
          setProduct((previousProduct) => ({
            ...previousProduct,
            reviews: updatedReviews.data.reviews,
            rating: updatedReviews.data.rating,
            reviewCount: updatedReviews.data.reviewCount,
          }));
        }
      }

    } catch (error) {
      console.log("Review Submit Error:", error);

      setMessage(
        error.response?.data?.message ||
        "Unable to submit your review."
      );

    } finally {
      setReviewLoading(false);

      setTimeout(() => {
        setMessage("");
      }, 4000);
    }
  };


  // ---------------- PRODUCT NOT FOUND ----------------

  if (!product) {
    return (
      <>
        <Nav cartCount={getCartCount()} />

        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F1] px-4">

          <div className="text-center">

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#14172E]">
              Product Not Found
            </h2>

            <button
              onClick={() => navigate("/collections")}
              className="
                mt-8
                px-7
                sm:px-8
                py-3.5
                sm:py-4
                rounded-full
                bg-[#14172E]
                text-white
                font-semibold
                hover:bg-[#FF6A3D]
                transition-all
              "
            >
              Back to Collections
            </button>

          </div>

        </div>
      </>
    );
  }


  return (
    <>
      <Nav cartCount={getCartCount()} />

      <main className="min-h-screen bg-[#FAF7F1]">


        {/* PRODUCT HERO */}

        <section
          className="
            w-full
            px-4
            sm:px-6
            md:px-8
            lg:px-14
            xl:px-24
            py-5
            sm:py-8
            lg:py-10
            border-b
            border-gray-200/60
          "
        >

          <button
            onClick={() => navigate(-1)}
            className="
              flex
              items-center
              gap-2
              text-[#14172E]
              font-semibold
              text-sm
              sm:text-base
              hover:text-[#FF6A3D]
              transition-colors
              mb-6
              sm:mb-8
            "
          >
            <FiArrowLeft size={20} />
            Back to Collection
          </button>


          <div
            className="
              max-w-[1800px]
              w-full
              mx-auto
              grid
              grid-cols-1
              lg:grid-cols-[1.1fr_0.9fr]
              gap-8
              md:gap-10
              xl:gap-20
              items-start
            "
          >


            {/* IMAGE GALLERY */}

            <div
              className="
                flex
                flex-col
                gap-4
                lg:flex-row
                lg:gap-5
              "
            >


              {/* THUMBNAILS */}

              <div
                className="
                  order-2
                  lg:order-1
                  flex
                  flex-row
                  lg:flex-col
                  gap-3
                  overflow-x-auto
                  lg:overflow-visible
                  pb-1
                  lg:pb-0
                  shrink-0
                  lg:justify-center
                "
              >

                {productImages.map((image, index) => (

                  <button
                    key={image}
                    onClick={() => setSelectedImage(index)}
                    className={`
                      shrink-0
                      w-16
                      h-16
                      sm:w-20
                      sm:h-20
                      lg:w-24
                      lg:h-24
                      rounded-xl
                      sm:rounded-2xl
                      overflow-hidden
                      border-2
                      transition-all

                      ${
                        selectedImage === index
                          ? "border-[#FF6A3D] scale-105 shadow-lg"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }
                    `}
                  >

                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                  </button>

                ))}

              </div>


              {/* MAIN IMAGE */}

              <div
                className="
                  order-1
                  lg:order-2
                  relative
                  w-full
                  h-[420px]
                  sm:h-[560px]
                  md:h-[650px]
                  lg:h-[calc(100vh-170px)]
                  lg:min-h-[560px]
                  lg:max-h-[850px]
                  rounded-3xl
                  lg:rounded-[40px]
                  overflow-hidden
                  bg-[#F1ECE3]
                  shadow-md
                "
              >

                <motion.img
                  key={productImages[selectedImage]}
                  initial={{
                    opacity: 0,
                    scale: 1.03,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.35,
                  }}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                  "
                />


                {product.bestseller && (

                  <div
                    className="
                      absolute
                      top-4
                      left-4
                      sm:top-6
                      sm:left-6
                      bg-[#FF6A3D]
                      text-white
                      px-4
                      sm:px-5
                      py-2
                      sm:py-2.5
                      rounded-full
                      font-bold
                      text-sm
                      sm:text-base
                      shadow-xl
                    "
                  >
                    Bestseller
                  </div>

                )}


                <button
                  onClick={() => setWishlist(!wishlist)}
                  className="
                    absolute
                    top-4
                    right-4
                    sm:top-6
                    sm:right-6
                    w-11
                    h-11
                    sm:w-14
                    sm:h-14
                    rounded-full
                    bg-white/90
                    backdrop-blur
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    hover:scale-110
                    transition-all
                  "
                >

                  <FiHeart
                    size={22}
                    className={
                      wishlist
                        ? "fill-[#FF6A3D] text-[#FF6A3D]"
                        : "text-[#14172E]"
                    }
                  />

                </button>


                {productImages.length > 1 && (

                  <>

                    <button
                      onClick={() =>
                        setSelectedImage(
                          selectedImage === 0
                            ? productImages.length - 1
                            : selectedImage - 1
                        )
                      }
                      className="
                        absolute
                        left-3
                        sm:left-5
                        top-1/2
                        -translate-y-1/2
                        w-10
                        h-10
                        sm:w-12
                        sm:h-12
                        rounded-full
                        bg-white/90
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        hover:bg-[#FF6A3D]
                        hover:text-white
                        transition-all
                      "
                    >
                      <FaChevronLeft size={14} />
                    </button>


                    <button
                      onClick={() =>
                        setSelectedImage(
                          selectedImage === productImages.length - 1
                            ? 0
                            : selectedImage + 1
                        )
                      }
                      className="
                        absolute
                        right-3
                        sm:right-5
                        top-1/2
                        -translate-y-1/2
                        w-10
                        h-10
                        sm:w-12
                        sm:h-12
                        rounded-full
                        bg-white/90
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        hover:bg-[#FF6A3D]
                        hover:text-white
                        transition-all
                      "
                    >
                      <FaChevronRight size={14} />
                    </button>

                  </>

                )}

              </div>

            </div>


            {/* PRODUCT INFORMATION */}

            <div className="flex flex-col py-2 lg:py-4">

              <div>


                {/* CATEGORY */}

                <p
                  className="
                    uppercase
                    tracking-[0.2em]
                    sm:tracking-[0.25em]
                    text-xs
                    sm:text-sm
                    lg:text-base
                    text-[#FF6A3D]
                    font-extrabold
                  "
                >
                  {product.category}
                </p>


                {/* PRODUCT NAME */}

                <h1
                  className="
                    mt-3
                    text-3xl
                    sm:text-4xl
                    md:text-5xl
                    lg:text-5xl
                    xl:text-6xl
                    font-extrabold
                    leading-tight
                    text-[#14172E]
                  "
                >
                  {product.name}
                </h1>


                {/* RATING */}

                {averageRating > 0 && (

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                      mt-4
                      text-sm
                      sm:text-base
                    "
                  >

                    <div className="flex gap-1">

                      {[1, 2, 3, 4, 5].map((star) => (

                        <FaStar
                          key={star}
                          size={15}
                          className={
                            star <= Math.round(averageRating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />

                      ))}

                    </div>

                    <span className="text-[#14172E] font-bold">
                      {averageRating.toFixed(1)}
                    </span>

                    <span className="text-gray-500">
                      ({product.reviewCount || 0} reviews)
                    </span>

                  </div>

                )}


                {/* PRICE */}

                <div className="mt-4">

                  <span
                    className="
                      text-3xl
                      sm:text-4xl
                      lg:text-5xl
                      font-extrabold
                      text-[#FF6A3D]
                    "
                  >
                    {currency}
                    {product.price}
                  </span>

                </div>


                {/* DESCRIPTION */}

                <p
                  className="
                    mt-5
                    text-base
                    sm:text-lg
                    xl:text-xl
                    leading-relaxed
                    text-gray-600
                  "
                >
                  {product.description}
                </p>


                {/* SIZE */}

                {product.sizes?.length > 0 && (

                  <div className="mt-6">

                    <div
                      className="
                        flex
                        justify-between
                        items-center
                        gap-4
                        mb-3
                      "
                    >

                      <h3 className="text-lg font-bold text-[#14172E]">
                        Select Size
                      </h3>

                      <span className="text-sm text-gray-500 font-medium">
                        Required
                      </span>

                    </div>


                    <div className="flex flex-wrap gap-3">

                      {product.sizes.map((size) => (

                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`

                            min-w-[58px]
                            sm:min-w-[60px]
                            px-4
                            sm:px-5
                            py-2.5
                            sm:py-3
                            rounded-xl
                            border-2
                            font-bold
                            text-base
                            sm:text-lg
                            transition-all

                            ${
                              selectedSize === size
                                ? "bg-[#14172E] text-white border-[#14172E] shadow-md scale-105"
                                : "bg-white text-[#14172E] border-gray-200 hover:border-[#FF6A3D]"
                            }
                          `}
                        >

                          {size}

                          {selectedSize === size && (

                            <FaCheck className="inline ml-2 text-sm" />

                          )}

                        </button>

                      ))}

                    </div>

                  </div>

                )}


                {/* QUANTITY */}

                <div className="mt-6">

                  <h3 className="text-lg font-bold text-[#14172E] mb-3">
                    Quantity
                  </h3>


                  <div
                    className="
                      flex
                      items-center
                      w-fit
                      border-2
                      border-gray-200
                      rounded-xl
                      overflow-hidden
                      bg-white
                    "
                  >

                    <button
                      onClick={() =>
                        setQuantity(
                          Math.max(1, quantity - 1)
                        )
                      }
                      className="
                        px-4
                        sm:px-5
                        py-2.5
                        text-xl
                        font-bold
                        hover:bg-gray-100
                        transition-colors
                      "
                    >
                      −
                    </button>


                    <span className="px-5 sm:px-6 text-lg font-bold">
                      {quantity}
                    </span>


                    <button
                      onClick={() =>
                        setQuantity(quantity + 1)
                      }
                      className="
                        px-4
                        sm:px-5
                        py-2.5
                        text-xl
                        font-bold
                        hover:bg-gray-100
                        transition-colors
                      "
                    >
                      +
                    </button>

                  </div>

                </div>


                {/* MESSAGE */}

                {message && (

                  <div
                    className="
                      mt-5
                      p-3.5
                      rounded-xl
                      bg-white
                      border
                      border-gray-200
                      text-[#14172E]
                      text-sm
                      sm:text-base
                      font-semibold
                    "
                  >
                    {message}
                  </div>

                )}

              </div>


              {/* ACTION BUTTONS */}

              <div className="mt-8">

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                    sm:gap-4
                  "
                >

                  <motion.button
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={handleAddToCart}
                    className="
                      flex
                      items-center
                      justify-center
                      gap-3
                      py-4
                      px-5
                      rounded-xl
                      bg-[#14172E]
                      text-white
                      text-base
                      sm:text-lg
                      font-bold
                      hover:bg-[#FF6A3D]
                      transition-all
                      shadow-lg
                    "
                  >
                    <FaShoppingBag size={19} />
                    Add to Cart
                  </motion.button>


                  <motion.button
                    whileTap={{
                      scale: 0.97,
                    }}
                    onClick={handleBuyNow}
                    className="
                      py-4
                      px-5
                      rounded-xl
                      bg-[#FF6A3D]
                      text-white
                      text-base
                      sm:text-lg
                      font-bold
                      hover:bg-[#14172E]
                      transition-all
                      shadow-lg
                    "
                  >
                    Buy Now
                  </motion.button>

                </div>


                {/* TRUST INFORMATION */}

     

              </div>

            </div>

          </div>

        </section>


        {/* REVIEWS */}

        <section
          className="
            w-full
            px-4
            sm:px-6
            md:px-8
            lg:px-16
            xl:px-24
            py-16
            sm:py-20
            lg:py-24
            bg-[#FAF7F1]
          "
        >

          <div
            className="
              max-w-[1600px]
              mx-auto
              grid
              grid-cols-1
              lg:grid-cols-[1fr_0.8fr]
              gap-10
              lg:gap-16
            "
          >


            {/* EXISTING REVIEWS */}

            <div>

              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-5xl
                  font-bold
                  text-[#14172E]
                "
              >
                Customer Reviews
              </h2>


              <p className="mt-4 text-gray-500 text-base sm:text-lg">
                Real experiences from the FurEver community.
              </p>


              {reviewsLoading ? (

                <div className="mt-10 text-gray-500 text-lg">
                  Loading reviews...
                </div>

              ) : product.reviews?.length === 0 ? (

                <div
                  className="
                    mt-10
                    bg-white
                    rounded-3xl
                    p-7
                    sm:p-10
                    text-center
                    border
                    border-gray-100
                  "
                >

                  <p className="text-xl font-semibold text-[#14172E]">
                    No reviews yet.
                  </p>

                  <p className="text-gray-500 mt-2">
                    Be the first person to review this product.
                  </p>

                </div>

              ) : (

                <div className="mt-10 space-y-5 sm:space-y-6">

                  {product.reviews.map((review) => (

                    <div
                      key={review._id}
                      className="
                        bg-white
                        rounded-3xl
                        p-5
                        sm:p-7
                        lg:p-9
                        shadow-sm
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          sm:justify-between
                          gap-3
                        "
                      >

                        <div>

                          <h3
                            className="
                              font-bold
                              text-[#14172E]
                              text-lg
                            "
                          >
                            {review.user?.name || "Customer"}
                          </h3>


                          <div className="flex gap-1 mt-2">

                            {[1, 2, 3, 4, 5].map((star) => (

                              <FaStar
                                key={star}
                                className={
                                  star <= review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              />

                            ))}

                          </div>

                        </div>


                        <span className="text-gray-400 text-sm">
                          {review.createdAt
                            ? new Date(
                                review.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </span>

                      </div>


                      <p
                        className="
                          mt-5
                          text-gray-600
                          text-base
                          sm:text-lg
                          leading-relaxed
                        "
                      >
                        {review.comment}
                      </p>

                    </div>

                  ))}

                </div>

              )}

            </div>


            {/* REVIEW FORM */}

            <div>

              <div
                className="
                  bg-white
                  rounded-3xl
                  lg:rounded-[32px]
                  p-6
                  sm:p-8
                  lg:p-12
                  shadow-sm
                  lg:sticky
                  lg:top-10
                "
              >

                <h2
                  className="
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    font-bold
                    text-[#14172E]
                  "
                >
                  Share Your Experience
                </h2>


                <p className="mt-4 text-gray-500 text-base sm:text-lg">
                  Your honest feedback helps other customers make better
                  decisions.
                </p>


                {!userData && (

                  <div
                    className="
                      mt-8
                      p-4
                      sm:p-5
                      rounded-2xl
                      bg-[#FAF7F1]
                      text-[#14172E]
                    "
                  >
                    Please{" "}

                    <button
                      onClick={() =>
                        navigate("/login", {
                          state: {
                            from: location.pathname,
                          },
                        })
                      }
                      className="
                        font-bold
                        text-[#FF6A3D]
                        underline
                      "
                    >
                      log in
                    </button>{" "}

                    to submit a review.
                  </div>

                )}


                <form
                  onSubmit={handleReviewSubmit}
                  className="mt-8"
                >


                  {/* RATING */}

                  <label
                    className="
                      block
                      font-bold
                      text-[#14172E]
                      mb-4
                    "
                  >
                    Your Rating
                  </label>


                  <div className="flex gap-2 sm:gap-3">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <button
                        type="button"
                        key={star}
                        onClick={() =>
                          setReviewRating(star)
                        }
                        className="
                          hover:scale-125
                          transition-transform
                        "
                      >

                        <FaStar
                          size={28}
                          className={
                            star <= reviewRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />

                      </button>

                    ))}

                  </div>


                  {/* REVIEW */}

                  <textarea
                    value={reviewText}
                    onChange={(e) =>
                      setReviewText(e.target.value)
                    }
                    placeholder="Tell us what you think about this product..."
                    rows="6"
                    className="
                      mt-7
                      w-full
                      resize-none
                      rounded-2xl
                      border-2
                      border-gray-200
                      p-4
                      sm:p-5
                      text-base
                      sm:text-lg
                      outline-none
                      focus:border-[#FF6A3D]
                      transition-all
                    "
                  />


                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="
                      mt-6
                      w-full
                      py-4
                      sm:py-5
                      rounded-2xl
                      bg-[#14172E]
                      text-white
                      text-base
                      sm:text-lg
                      font-bold
                      hover:bg-[#FF6A3D]
                      transition-all
                      disabled:opacity-50
                    "
                  >
                    {reviewLoading
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>

                </form>

              </div>

            </div>

          </div>

        </section>


        {/* RELATED PRODUCTS */}

        {relatedProducts.length > 0 && (

          <section
            className="
              w-full
              px-4
              sm:px-6
              md:px-8
              lg:px-16
              xl:px-24
              py-16
              sm:py-20
              lg:py-24
              bg-white
            "
          >

            <div className="max-w-[1800px] mx-auto">


              <div className="text-center">

                <p
                  className="
                    uppercase
                    tracking-[0.2em]
                    sm:tracking-[0.3em]
                    text-sm
                    text-[#FF6A3D]
                    font-bold
                  "
                >
                  You May Also Like
                </p>


                <h2
                  className="
                    mt-4
                    text-3xl
                    sm:text-4xl
                    lg:text-6xl
                    font-bold
                    text-[#14172E]
                  "
                >
                  Related Products
                </h2>

              </div>


              <div
                className="
                  mt-10
                  sm:mt-14
                  grid
                  grid-cols-1
                  min-[480px]:grid-cols-2
                  lg:grid-cols-4
                  gap-5
                  sm:gap-8
                "
              >

                {relatedProducts.map((relatedProduct) => (

                  <motion.div
                    key={relatedProduct._id}
                    whileHover={{
                      y: -10,
                    }}
                    onClick={() => {

                      window.scrollTo(0, 0);

                      navigate(
                        `/product/${relatedProduct._id}`
                      );

                    }}
                    className="
                      cursor-pointer
                      bg-[#FAF7F1]
                      rounded-3xl
                      overflow-hidden
                      transition-all
                      duration-300
                    "
                  >

                    <img
                      src={relatedProduct.image1}
                      alt={relatedProduct.name}
                      className="
                        w-full
                        aspect-square
                        object-cover
                      "
                    />


                    <div className="p-5 sm:p-6">

                      <h3
                        className="
                          text-lg
                          sm:text-xl
                          font-bold
                          text-[#14172E]
                        "
                      >
                        {relatedProduct.name}
                      </h3>


                      <p
                        className="
                          mt-3
                          text-xl
                          sm:text-2xl
                          font-bold
                          text-[#FF6A3D]
                        "
                      >
                        {currency}
                        {relatedProduct.price}
                      </p>

                    </div>

                  </motion.div>

                ))}

              </div>

            </div>

          </section>

        )}

      </main>
    </>
  );
}


export default ProductDetail;