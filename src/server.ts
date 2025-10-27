import { App } from "./config/express"

const PORT = process.env.PORT || 5000;

export default new App().server.listen(PORT, () => console.log(`Server running on port ${PORT}`))