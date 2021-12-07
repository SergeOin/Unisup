module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '8eb36cc4665acf107ea2c39befdd9464'),
  },
});
