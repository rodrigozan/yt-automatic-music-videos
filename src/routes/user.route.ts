import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Obtém a lista de todos os usuários
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   celular:
 *                     type: string
 *                   active:
 *                     type: boolean
 *                   role:
 *                     type: string
 */
router.get('/users', (_req: Request, res: Response) => {
  res.json({ message: 'List of users' });
});

export default router;