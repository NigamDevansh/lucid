import T from "../../translations/index.js";
import type { FastifyRequest, FastifyReply } from "fastify";
import constants from "../../constants/constants.js";
import jwt from "jsonwebtoken";
import { LucidAPIError } from "../../utils/errors/index.js";
import lucidServices from "../index.js";
import Repository from "../../libs/repositories/index.js";

// TODO: make all functions here use service wrapper and ServiceFn - seperate into own file in refresh token directory

const key = "_refresh";

export const generateRefreshToken = async (
	reply: FastifyReply,
	request: FastifyRequest,
	userId: number,
) => {
	await clearRefreshToken(request, reply);
	const UserTokensRepo = Repository.get(
		"user-tokens",
		request.server.config.db.client,
	);

	const payload = {
		id: userId,
	};

	const token = jwt.sign(
		payload,
		request.server.config.keys.refreshTokenSecret,
		{
			expiresIn: constants.refreshTokenExpiration,
		},
	);

	reply.setCookie(key, token, {
		maxAge: constants.refreshTokenExpiration,
		httpOnly: true,
		secure: request.protocol === "https",
		sameSite: "strict",
		path: "/",
	});

	await UserTokensRepo.createSingle({
		userId: userId,
		token: token,
		tokenType: "refresh",
		expiryDate: new Date(
			Date.now() + constants.refreshTokenExpiration * 1000, // convert to ms
		).toISOString(),
	});
};

export const verifyRefreshToken = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	try {
		const _refresh = request.cookies[key];

		if (!_refresh) {
			throw new Error("No refresh token found");
		}

		const UserTokensRepo = Repository.get(
			"user-tokens",
			request.server.config.db.client,
		);

		const decode = jwt.verify(
			_refresh,
			request.server.config.keys.refreshTokenSecret,
		) as {
			id: number;
		};

		const token = await UserTokensRepo.selectSingle({
			select: ["id", "user_id"],
			where: [
				{
					key: "token",
					operator: "=",
					value: _refresh,
				},
				{
					key: "token_type",
					operator: "=",
					value: "refresh",
				},
				{
					key: "user_id",
					operator: "=",
					value: decode.id,
				},
				{
					key: "expiry_date",
					operator: ">",
					value: new Date().toISOString(),
				},
			],
		});

		if (token === undefined) {
			throw new Error(T("no_refresh_token_found"));
		}

		return {
			userId: decode.id,
		};
	} catch (err) {
		await Promise.all([
			clearRefreshToken(request, reply),
			lucidServices.auth.accessToken.clearAccessToken(reply),
		]);
		throw new LucidAPIError({
			type: "authorisation",
			name: T("refresh_token_error_name"),
			message: T("refresh_token_error_message"),
			status: 401,
		});
	}
};

export const clearRefreshToken = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const _refresh = request.cookies[key];
	if (!_refresh) return;

	const UserTokensRepo = Repository.get(
		"user-tokens",
		request.server.config.db.client,
	);

	const decode = jwt.verify(
		_refresh,
		request.server.config.keys.refreshTokenSecret,
	) as {
		id: number;
	};

	reply.clearCookie(key, { path: "/" });

	await UserTokensRepo.deleteMultiple({
		where: [
			{
				key: "token",
				operator: "=",
				value: _refresh,
			},
			{
				key: "token_type",
				operator: "=",
				value: "refresh",
			},
			{
				key: "user_id",
				operator: "=",
				value: decode.id,
			},
		],
	});
};

export default {
	generateRefreshToken,
	verifyRefreshToken,
	clearRefreshToken,
};
