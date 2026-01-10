export interface TokenService {
	signAccessToken(payload: { sub: string; email: string }): Promise<string>;
}
