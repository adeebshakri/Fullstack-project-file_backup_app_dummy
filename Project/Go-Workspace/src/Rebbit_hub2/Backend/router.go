package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"modfile/github.com/dgrijalva/jwt-go"
	"net/http"
	"strconv"
	"strings"
)

func addUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	dbQuery, err := database.Prepare("INSERT INTO user(username,password) VALUES(?,?)")
	if err != nil {
		log.Fatal(err.Error())
	}
	log.Println("Registering users")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err.Error())
	}

	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	username := keyVal["username"]
	password := keyVal["password"]

	log.Println(username, password)
	_, err = dbQuery.Exec(username, password)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Fprintf(w, "New User was added")
	fmt.Println("New User was added")
}

// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time

type JWTResponse struct {
	Success      bool   `json:success`
	Message      string `json:"message"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func login1(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	credentials := &User{}
	err := json.NewDecoder(r.Body).Decode(credentials)
	if err != nil {
		// 400 status is returned if there is something wrong with the request body
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	result := database.QueryRow("select user_id,username, password from user where username = ?", credentials.Username)

	if err != nil {
		// If there is an issue with the database, return a 500 error
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	storedCreds := &User{}
	var userID string
	err = result.Scan(&userID, &storedCreds.Username, &storedCreds.Password)
	//If there is an error and no such row is present
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(JWTResponse{
				Success: false,
				Message: "User does not exist",
			})
			return
		}
		// If the error is of any other type, send a 500 status
		w.WriteHeader(http.StatusInternalServerError)
		return

	}
	if storedCreds.Password != credentials.Password {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(JWTResponse{
			Success: false,
			Message: "Incorrect Password",
		})
		return
	}
	accessToken, refreshToken, err := generateTokenPair(userID, storedCreds)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	//Provide token here
	json.NewEncoder(w).Encode(JWTResponse{
		Success:      true,
		Message:      "Login Successful",
		AccessToken:  *accessToken,
		RefreshToken: *refreshToken,
	})

}

type RefreshTokenReqBody struct {
	RefreshToken string `json:"refresh_token"`
}

func refresh(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	requestBody := &RefreshTokenReqBody{}
	err := json.NewDecoder(r.Body).Decode(requestBody)
	if err != nil {
		// If there is something wrong with the request body, return a 400 status
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	refreshSecret := "REFRESH_SECRET"
	//fmt.Println("1")
	//fmt.Println("requestBody.RefreshToken:", requestBody.RefreshToken)
	//We need to validate the token and extract the claims from it, to do this, we need to parse the token.
	token, err := jwt.Parse(requestBody.RefreshToken, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(refreshSecret), nil
	})
	if err != nil {
		//fmt.Println("3") //error!!
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	//fmt.Println("2")

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Get the user record from database or
		// run through your business logic to verify if the user can log in
		fmt.Println("claims: ", claims)
		result := database.QueryRow("select user_id, username from user where user_id = ?", claims["user_id"])

		if err != nil {
			// If there is an issue with the database, return a 500 error
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		storedUser := &User{}
		var userID string
		err = result.Scan(&userID, &storedUser.Username)
		//If there is an error and no such row is present
		if err != nil {
			if err == sql.ErrNoRows {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(JWTResponse{
					Success: false,
					Message: "User does not exist",
				})
				return
			}
			// If the error is of any other type, send a 500 status
			w.WriteHeader(http.StatusInternalServerError)
			return

		}
		accessToken, refreshToken, err := generateTokenPair(userID, storedUser)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		fmt.Println("4")
		//Provide token here
		json.NewEncoder(w).Encode(JWTResponse{
			Success:      true,
			Message:      "Refresh Token Granted",
			AccessToken:  *accessToken,
			RefreshToken: *refreshToken,
		})

	}
	w.WriteHeader(http.StatusUnauthorized)
	return

}

func reportAllFilesDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	reqToken := r.Header.Get("Authorization")
	//fmt.Println("reqToken: ", reqToken)

	splitToken := strings.Split(reqToken, "Bearer ")
	//fmt.Println("splitToken: ", splitToken)
	reqToken = splitToken[1]
	//fmt.Println("Token: ", reqToken)
	token, err := jwt.Parse(reqToken, func(t *jwt.Token) (interface{}, error) {

		return []byte("ACCESS_SECRET"), nil
	})
	if err != nil && !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println("invalid token")
		return
	}
	fmt.Println("valid token")
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Get the user record from database or
		// run through your business logic to verify if the user can log in
		fmt.Println("claims: ", claims)
		fmt.Println("claims user_id: ", claims["user_id"])

		var versionArray []Version
		log.Println("Fetching all the versions of all files backed up")
		//Fetching the unique dates and the corresponding versions of different files backed up in different devices and the correspoding space consumed by them
		ver, err := database.Query("SELECT v.version_id, v.file_id, v.file_name, v.file_path, v.version_size,v.version_time, v.device_id FROM rebbit_hub.device d, rebbit_hub.files_backedup f, rebbit_hub.version v WHERE d.user_id = ? AND f.file_id = v.file_id AND d.device_id = f.device_id AND f.is_deleted = 0 ORDER BY v.version_time DESC;", claims["user_id"])
		if err != nil {
			log.Fatal(err.Error())
		}
		defer ver.Close()
		for ver.Next() {
			var eachVer Version
			err := ver.Scan(&eachVer.Version_id, &eachVer.File_id, &eachVer.File_name, &eachVer.File_path, &eachVer.Version_size, &eachVer.Version_time, &eachVer.Device_id)
			if err != nil {
				log.Fatal(err.Error())
			}
			versionArray = append(versionArray, eachVer)
		}
		json.NewEncoder(w).Encode(versionArray)
	}
	return

}

func reportUserSubscriptionDetails(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer ")
	reqToken = splitToken[1]
	//fmt.Println("Token: ", reqToken)
	token, err := jwt.Parse(reqToken, func(t *jwt.Token) (interface{}, error) {

		return []byte("ACCESS_SECRET"), nil
	})
	if err != nil && !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Println("invalid token")
		return
	}
	fmt.Println("valid token")
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		//fmt.Println("claims: ", claims)
		//fmt.Println("claims user_id: ", claims["user_id"])

		//Fetching the total size of all files in all devices for a particular user
		var totalFileSize float64
		result1, err := database.Query("SELECT sum(f.file_size) AS total_files_size FROM rebbit_hub.device d, rebbit_hub.files_backedup f WHERE d.device_id=f.device_id AND f.is_deleted=0 AND d.user_id = ?", claims["user_id"])
		if err != nil {
			log.Fatal(err.Error())
		}
		defer result1.Close()
		for result1.Next() {
			err1 := result1.Scan(&totalFileSize)
			if err1 != nil {
				log.Fatal(err1.Error())
			}
		}

		//Fetching User subscription details and passing the whole User_details struct with embedding the calculated Subscription_size_used and Subscription_size_left
		var subscriptionArray []User_details
		result, err := database.Query("SELECT user_id,subscription_id,subscription_name,subscripton_size_capacity,subscription_start_date,subscription_end_date FROM user_details WHERE user_id=?", claims["user_id"])
		if err != nil {
			log.Fatal(err.Error())
		}
		defer result.Close()
		for result.Next() {
			var eachSubs User_details
			err := result.Scan(&eachSubs.User_id, &eachSubs.Subscription_id, &eachSubs.Subscription_name, &eachSubs.Subscripton_size_capacity, &eachSubs.Subscription_start_date, &eachSubs.Subscription_end_date)
			eachSubs.Subscription_size_used = strconv.FormatFloat(totalFileSize, 'f', 2, 64)
			s, _ := strconv.ParseFloat(eachSubs.Subscripton_size_capacity, 64)
			eachSubs.Subscription_size_left = strconv.FormatFloat((s - totalFileSize), 'f', 2, 64)
			if err != nil {
				log.Fatal(err.Error())
			}
			subscriptionArray = append(subscriptionArray, eachSubs)
		}
		json.NewEncoder(w).Encode(subscriptionArray)
	}
	return

}
