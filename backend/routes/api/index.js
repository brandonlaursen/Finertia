const router = require('express').Router();
const { User } = require('../../db/models');
const { restoreUser, setTokenCookie, requireAuth  } = require('../../utils/auth.js');

// * keep before other middlewear
router.use(restoreUser);







// * for testing
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });



// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );



// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );


// router.post('/test', function(req, res) {
//   res.json({ requestBody: req.body });
// });



module.exports = router;
