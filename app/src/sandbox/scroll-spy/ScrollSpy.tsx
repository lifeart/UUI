import { Component, ReactNode, useCallback, useEffect, useState } from 'react';

export interface ScrollSpyApi {
    scrollToElement: (item?: string) => void;
    currentActive?: string;
    setRef: (ref: HTMLElement) => void;
}
interface ScrollSpyProps {
    root?: HTMLElement;
    elements?: Readonly<string[]>;
    options?: IntersectionObserverInit;
    children?: (api: ScrollSpyApi) => ReactNode;
}

export function useScrollSpy(
    elements?: ScrollSpyProps['elements'],
    options?: ScrollSpyProps['options']
) : ScrollSpyApi {
    const [ref, setRef] = useState<HTMLElement>(null);
    const [currentActive, setCurrentActive] = useState<string>(Array.isArray(elements) && elements.length > 0 && elements[0]);
    const [observedNodes, setObservedNodes] = useState<HTMLElement[]>([]);

    const scrollToElement = useCallback(
        (root: ScrollSpyProps['root'], elements?: ScrollSpyProps['elements']): ((item?: string) => void) => {
            return item => {
                let element;

                if (!elements || elements.length === 0 || !Array.isArray(elements) || !item) {
                    element = root.querySelector('.uui-invalid').closest('.uui-label-top');
                } else if (item && elements.includes(item)) {
                    const selected = elements.find(i => i === item);
                    if (selected) {
                        element = root.querySelector(`[id='${selected}'], [data-spy='${selected}'], [name='${selected}']`);
                    }
                };

                element && element.scrollIntoView({ block: 'start', behavior: 'smooth' });
            };
        }, []
    );

    useEffect(() => {
        if (!ref || !elements || !Array.isArray(elements) || elements.length === 0) return;
        setObservedNodes(elements.map(element => {
            return ref.querySelector(`[id='${element}'], [data-spy='${element}'], [name='${element}']`)
        }));
    }, [ref]);

    useEffect(() => {
        if (observedNodes.length === 0) return;

        const observer = new IntersectionObserver(entries => {
            const intersectingElement = entries.find(entry => entry.isIntersecting) as any;
            setCurrentActive(intersectingElement?.target?.dataset?.spy);
        }, options);

        observedNodes.forEach(element => element ? observer.observe(element) : null);

        return () => observer.disconnect();
    }, [observedNodes]);

    return {
        scrollToElement: scrollToElement(ref, elements),
        currentActive,
        setRef,
    };
};

export function ScrollSpy({ elements, children } : ScrollSpyProps) {
    const { currentActive, scrollToElement,  setRef } = useScrollSpy(elements);
    return children({ scrollToElement, setRef, currentActive });
}