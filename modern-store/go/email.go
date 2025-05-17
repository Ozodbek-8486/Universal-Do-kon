package main

import (
    "encoding/json"
    "log"
    "net/http"

    "github.com/resend/resend-go/v2"
)

// Foydalanuvchi yuborgan ma'lumotlar
type EmailRequest struct {
    Name    string `json:"name"`
    Surname string `json:"surname"`
    Message string `json:"message"`
}

func sendEmail(w http.ResponseWriter, r *http.Request) {
    if r.Method != "POST" {
        http.Error(w, "Faqat POST requestga ruxsat berilgan", http.StatusMethodNotAllowed)
        return
    }

    var req EmailRequest
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        http.Error(w, "JSON ni o'qib bo'lmadi", http.StatusBadRequest)
        return
    }

    apiKey := "re_KtySEEmt_5dJG6Wtymc3xriHKgapSZP9Y"
    client := resend.NewClient(apiKey)

    html := "<p><strong>Ism:</strong> " + req.Name + "<br>" +
        "<strong>Familiya:</strong> " + req.Surname + "<br>" +
        "<strong>Xabar:</strong> " + req.Message + "</p>"

    params := &resend.SendEmailRequest{
        From:    "onboarding@resend.dev",
        To:      []string{"ozodbekusmonqulov7777@gmail.com"},
        Subject: "Saytdan yangi xabar",
        Html:    html,
    }

    _, err = client.Emails.Send(params)
    if err != nil {
        http.Error(w, "Email yuborishda xatolik", http.StatusInternalServerError)
        return
    }

    // Faqat status qaytaramiz, hech narsa chop qilmaymiz
    w.WriteHeader(http.StatusOK)
}

func main() {
    http.HandleFunc("/send", sendEmail)
    log.Println("Server ishga tushdi: http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}
