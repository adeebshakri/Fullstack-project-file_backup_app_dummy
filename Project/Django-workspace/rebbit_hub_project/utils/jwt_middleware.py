from django.http import JsonResponse
import jwt

class JWTMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # GET TOKEN
        auth = request.META.get('HTTP_AUTHORIZATION')

        if not auth:
            return JsonResponse(
                data={
                    "success": False,
                    "message": "Authorization header is expected"
                },
                status=401
            )

        parts = auth.split()

        if parts[0].lower() != "bearer":
            return JsonResponse(
                data={
                    "success": False,
                    "message": "Authorization header must start with Bearer"
                },
                status=401
            )
        elif len(parts) == 1:
            return JsonResponse(
                data={
                    "success": False,
                    "message": "Token not found"
                },
                status=401
            )
        elif len(parts) > 2:
            return JsonResponse(
                data={
                    "success": False,
                    "message": "Authorization header must be in the format 'Bearer token'"
                },
                status=401
            )

        token = parts[1]

        # VALIDATE TOKEN

        secret = "ACCESS_SECRET"
        try:
            payload = jwt.decode(token,secret)
            #maybe you need to use ~ jwt.decode(token,secret, algorithms=[‘HS256’])
            request.userTokenPayload = payload #adding payload from the token(getting details of user ie user_id and username)to the reuest
        except jwt.InvalidSignatureError:
            return JsonResponse(
                data={
                    "success": False,
                    "message": "Invalid token signature"
                },
                status=401
            )
        except jwt.ExpiredSignatureError:
            return JsonResponse(
                data={
                    "success": False,
                    "message": "Expired token"
                },
                status=401
            )
        except jwt.InvalidTokenError:
            return JsonResponse(
                data={
                    "success": False,
                    "message": "Invalid token"
                },
                status=401
            )

        response = self.get_response(request)
        return response
