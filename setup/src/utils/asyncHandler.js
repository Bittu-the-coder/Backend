// const asyncHandler = (func) => { () => { } }

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  }
}

export { asyncHandler }

// export default asyncHandler = (fn) => {
//   async (res, req, next) => {
//     try {
//       await fn(res, req, next);
//     } catch (err) {
//       next(err);
//       res.status(err.code || 500).json({
//         success: false,
//         message: err.message
//       });
//     }
//   }
// }