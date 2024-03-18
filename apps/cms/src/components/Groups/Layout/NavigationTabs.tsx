import { Component, For } from "solid-js";
import { Link } from "@solidjs/router";
// Components

interface NavigationTabsProps {
	tabs: {
		label: string;
		href?: string;
		onClick?: () => void;
	}[];
}

export const NavigationTabs: Component<NavigationTabsProps> = (props) => {
	// ----------------------------------------
	// Render
	return (
		<nav class="px-15 md:px-30">
			<ul class="flex flex-row flex-wrap justify-start items-center">
				<For each={props.tabs}>
					{(tab) => (
						<li class="mr-15">
							<Link
								class="flex pb-2.5 font-medium text-body border-b-2 border-transparent hover:border-secondary transition-colors duration-200"
								activeClass="!border-secondary text-title"
								href={tab.href || "#"}
								onClick={tab.onClick}
								end
							>
								{tab.label}
							</Link>
						</li>
					)}
				</For>
			</ul>
		</nav>
	);
};
