import React from 'react';
import Container from "../../../../common/Container.tsx";
import Icons from "../../../../helpers/IconProvider.tsx";

const Features = () => {
    const content: {
        icon: React.ReactNode,
    } = [
        {
            icon: Icons.box,
            title: "Fasted Delivery",
            "desc": "Delivery in 24/H"
        },
        {
            icon: Icons.creditCard,
            title: "Secure Payment",
            "desc": "Your money is safe"
        },
        {
            icon: Icons.headphones,
            title: "24/7 Support",
            "desc": "Live contact/message"
        },
        {
            icon: Icons.trophy,
            title: "24 Hours Return",
            "desc": "100% money-back guarantee"
        }
    ]
    return (
        <Container>
            <div className={"bg-gray-00 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 border" +
                " border-gray-100 rounded-md-"}>
                <div>
                    <span>{Icons.box}</span>
                    <div><h5>Fasted Delivery</h5></div>
                </div>
            </div>
        </Container>
    );
};

export default React.memo(Features);