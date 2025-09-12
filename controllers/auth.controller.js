// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const catchAsync = require('../utils/catchAsync');
// const User = require('../models/userModel');
// const Email = require('../utils/email');
// const AppError = require('../utils/appError');

// const signToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });

// const createSendToken = (user, statusCode, res, next) => {
//   if (!user.isVerified) {
//     return next(new AppError('Please verify your email first', 403));
//   }

//   const token = signToken(user.id);

//   const cookieOptions = {
//     httpOnly: true,
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
//     secure: process.env.NODE_ENV === 'production',
//   };

//   res.cookie('accessToken', token, cookieOptions);

//   user.password = undefined;

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user,
//     },
//   });
// };

// exports.signUp = catchAsync(async (req, res, next) => {
//   const newUser = await User.create({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     passwordConfirm: req.body.passwordConfirm,
//   });

//   const verifiedToken = newUser.createToken('verificationToken');

//   await newUser.save({ validateBeforeSave: false });

//   try {
//     const verifiedUrl = `${process.env.FRONTEND_URL}/verifiedEmail/${verifiedToken}`;

//     new Email(newUser, verifiedUrl).sendEmailVerify();

//     res.status(200).json({ status: 'success', message: 'Token send to email' });
//   } catch (error) {
//     return next(
//       new AppError(
//         'There was an error sending the email. Try again later!',
//         500
//       )
//     );
//   }
// });

// exports.verifiedEmail = catchAsync(async (req, res, next) => {
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');

//   const user = await User.findOne({
//     verificationToken: hashedToken,
//     verificationExpires: { $gt: Date.now() },
//   });

//   if (!user) return next(new AppError('token is invalid or has expired', 400));

//   user.isVerified = true;
//   user.verificationToken = undefined;
//   user.verificationExpires = undefined;

//   await user.save({ validateBeforeSave: true });

//   createSendToken(user, 200, res);
// });

const { getAuth, clerkClient } = require('@clerk/express');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.syncUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    // lấy user từ Clerk để sync
    const clerkUser = await clerkClient.users.getUser(userId);

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        name: clerkUser.firstName || clerkUser.username || 'No name',
        email: clerkUser.emailAddresses[0].emailAddress,
        clerkId: userId,
        avatar: clerkUser.imageUrl || 'default.jpg',
        isVerified:
          clerkUser.emailAddresses[0].verification?.status === 'verified',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = catchAsync(async (req, res, next) => {
  const { userId } = getAuth(req);

  const user = await User.findOne({ clerkId: userId }).populate('playlists');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
