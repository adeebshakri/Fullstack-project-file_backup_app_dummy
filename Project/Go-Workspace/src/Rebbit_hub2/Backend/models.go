package main

type User struct {
	User_id  string `json:"user_id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Device struct {
	User_id     string `json:"user_id"`
	Device_id   string `json:"device_id"`
	Device_name string `json:"device_name"`
}

type Files_backedup struct {
	File_id     string `json:"file_id"`
	File_name   string `json:"file_name"`
	File_path   string `json:"File_path"`
	Is_backedup string `json:"is_backedup"`
	File_size   string `json:"file_size"`
	File_time   string `json:"file_time"`
	Device_id   string `json:"device_id"`
}

type Version struct {
	Version_id   string `json:"version_id"`
	File_id      string `json:"file_id"`
	File_name    string `json:"file_name"`
	File_path    string `json:"file_path"`
	Is_backedup  string `json:"is_backedup"`
	Version_size string `json:"version_size"`
	Version_time string `json:"version_time"`
	Device_id    string `json:"device_id"`
}
type User_details struct {
	User_id                   string `json:"user_id"`
	Subscription_id           string `json:"subscription_id"`
	Subscription_name         string `json:"subscription_name"`
	Subscripton_size_capacity string `json:"subscripton_size_capacity"`
	Subscription_size_used    string `json:"subscripton_size_used"`
	Subscription_size_left    string `json:"subscripton_size_left"`
	Subscription_start_date   string `json:"subscription_start_date"`
	Subscription_end_date     string `json:"Subscription_end_date"`
}
