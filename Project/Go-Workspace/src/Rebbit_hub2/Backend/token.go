package main

import (
	"modfile/github.com/dgrijalva/jwt-go"
	"time"
)

func generateTokenPair(userID string, user *User) (*string, *string, error) {
	var accessSecret = "ACCESS_SECRET"
	var refreshSecret = "REFRESH_SECRET"
	// Create token
	accessToken := jwt.New(jwt.SigningMethodHS256)

	// Set claims
	// This is the information which frontend can use
	// The backend can also decode the accessToken.
	atClaims := accessToken.Claims.(jwt.MapClaims)
	atClaims["user_id"] = userID
	atClaims["username"] = user.Username
	//fmt.Println("At claims:", atClaims["user_id"])
	//fmt.Println("At claims:", atClaims["username"])
	atClaims["exp"] = time.Now().Add(time.Minute * 55).Unix()

	// Generate encoded accessToken and send it as response.
	// The signing string should be secret (a generated UUID works too)
	at, err := accessToken.SignedString([]byte(accessSecret))
	if err != nil {
		return nil, nil, err
	}

	refreshToken := jwt.New(jwt.SigningMethodHS256)
	rtClaims := refreshToken.Claims.(jwt.MapClaims)
	rtClaims["user_id"] = userID
	atClaims["username"] = user.Username
	rtClaims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	rt, err := refreshToken.SignedString([]byte(refreshSecret))
	if err != nil {
		return nil, nil, err
	}

	return &at, &rt, nil

}
