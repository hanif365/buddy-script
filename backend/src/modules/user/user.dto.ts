export const publicUser = (user: {
  _id: unknown;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
}) => ({
  id: String(user._id),
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  avatar: user.avatar,
});
