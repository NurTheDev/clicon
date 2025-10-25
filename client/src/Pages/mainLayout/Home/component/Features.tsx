import React from 'react';
import Container from "../../../../common/Container.tsx";
import Icons from "../../../../helpers/IconProvider.tsx";

const Features = () => {
    const content: {
        icon: React.ReactNode,
        title: string,
        desc: string,
    }[] = [
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
                " border-gray-100 rounded-md shadow-sm lg:mt-10 mt-5"}>
                {content?.map((item, index) => (
                    <div key={index} className={"flexRowCenter gap-x-5 p-4 border-r border-r-gray-100 " +
                        "last:border-0 hover:bg-gray-50 transition-all duration-200 cursor-pointer"}>
                        <span className={"text-4xl"}>{item.icon}</span>
                        <div className={"flexColumnStart text-gray-900 font-public-sans gap-y-1"}><h5 className={"font-medium"}>{item.title}</h5>
                            <p className={"text-sm"}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default React.memo(Features);