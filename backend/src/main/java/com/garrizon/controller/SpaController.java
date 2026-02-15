package com.garrizon.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Controller to handle Single Page Application (SPA) routing.
 * It forwards all non-API and non-static-resource requests to index.html
 * so that React Router can handle the client-side routing.
 */
@Controller
public class SpaController {

    @RequestMapping(value = {
            "/login",
            "/register",
            "/products",
            "/products/{slug}",
            "/cart",
            "/checkout",
            "/admin/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
