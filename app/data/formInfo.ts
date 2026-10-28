const formInfo = {
    "steps": [
        {
            "title": "Personal info",
            "sidebar_title": "Your Info",
            "description": "Please provide your name, email address, and phone number."
        },
        {
            "title": "Select your plan",
            "sidebar_title": "Select Plan",
            "description": "You have the option of monthly or yearly billing."
        },
        {
            "title": "Pick add-ones",
            "sidebar_title": "Add-Ones",
            "description": "Add-ones help enhance your gaming experience."
        },
        {
            "title": "Finishing up",
            "sidebar_title": "summary",
            "description": "Double-check everything looks OK before confirming."
        },
        {
            "title": "Thank you!",
            "sidebar_title": "",
            "description": "Thanks for confirming your subscription! We hope you have fun using our platform."
        }
    ],
    "plans": [
        {
            "title": "arcade",
            "price": {
                "monthly": 9,
                "yearly": 90
            }
        },
        {
            "title": "advanced",
            "price": {
                "monthly": 12,
                "yearly": 120
            }
        },
        {
            "title": "pro",
            "price": {
                "monthly": 15,
                "yearly": 150
            }
        }
    ],
    "addones": [
        {
            "title": "online service",
            "description": "Access to multiplayer games",
            "price": {
                "monthly": 1,
                "yearly": 10
            }
        },
        {
            "title": "larger storage",
            "description": "Extra 1TB of cloud save",
            "price": {
                "monthly": 2,
                "yearly": 20
            }
        },
        {
            "title": "customizable profile",
            "description": "Custom theme on your profile",
            "price": {
                "monthly": 2,
                "yearly": 20
            }
        }
    ]
} as const;

export default formInfo;
