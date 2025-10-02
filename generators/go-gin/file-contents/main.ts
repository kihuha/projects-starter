export const goMainContent = (routerGroups: string = "") => `package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

	server.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Hello there",
		})
	})
${routerGroups}
	server.Run()
}
`;
