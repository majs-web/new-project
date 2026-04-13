
import { requireAuth, checkUser } from "../middlewares/auth_middleware";

app.get('*', checkUser)
app.get('/', (request, response) => response.render('home'));
app.get('/profile', requireAuth, (request, response) => response.render('profile'));