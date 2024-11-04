import { apiSlice } from "../services/apiSlice";
import { setAuth } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        retrieveUser: builder.query<User, void>({
            query: () => '/users/me/'
        }),
		login: builder.mutation({
			query: ({ email, password }) => ({
				url: '/jwt/create/',
				method: 'POST',
				body: { email, password },
			}),
			async onQueryStarted(args, { dispatch, getState, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
		
					// Check if the token is already in the state to avoid setting it twice
					const currentToken = getState().auth.token;
					if (!currentToken) {
						dispatch(setAuth(data.access)); // Only dispatch if token is not set
					}
		
				} catch (error) {
					console.error('Login failed:', error);
				}
			},
		}),
		
		
        register: builder.mutation({
			
			query: ({
				first_name,
				last_name,
				address1, 
				city, 
				state, 
				postalCode, 
				dateOfBirth, 
				ssn, 
				email,
				password,
				re_password,
			}) => ({
				url: '/users/',
				method: 'POST',
				body: { first_name, last_name, address1, city, state, postalCode, dateOfBirth, ssn, email, password, re_password },
			}),
		}),
		verify: builder.mutation({
			query: () => ({
				url: '/jwt/verify/',
				method: 'POST',
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: '/logout/',
				method: 'POST',
			}),
		}),
		activation: builder.mutation({
			query: ({ uid, token }) => ({
				url: '/users/activation/',
				method: 'POST',
				body: { uid, token },
			}),
		}),
		resetPassword: builder.mutation({
			query: email => ({
				url: '/users/reset_password/',
				method: 'POST',
				body: { email },
			}),
		}),
		resetPasswordConfirm: builder.mutation({
			query: ({ uid, token, new_password, re_new_password }) => ({
				url: '/users/reset_password_confirm/',
				method: 'POST',
				body: { uid, token, new_password, re_new_password },
			}),
		}),
    })
})

export const { useRetrieveUserQuery,
	useLoginMutation,
	useRegisterMutation,
	useVerifyMutation,
	useLogoutMutation,
	useActivationMutation,
	useResetPasswordMutation,
	useResetPasswordConfirmMutation } = authApiSlice