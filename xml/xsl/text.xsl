<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:map="http://www.w3.org/2005/xpath-functions/map"
    xmlns:me="http://www.menota.org/ns/1.0"
    xmlns:tei="http://www.tei-c.org/ns/1.0">
    <xsl:output encoding="UTF-8" method="json" indent="yes"/>
    <xsl:strip-space elements="*"/>
    <xsl:template match="tei:text">
        <xsl:variable name="text" as="map(*)*">
            <xsl:apply-templates/>
        </xsl:variable>
        <xsl:map-entry key="'text'" select="array{$text}"/>
        <xsl:map-entry key="'language'" select="string(@xml:lang)"/>
    </xsl:template>
    <xsl:template match="tei:w|tei:num|tei:pc|me:punct">
        <xsl:choose>
            <xsl:when test="
                    (self::tei:pc|self::me:punct) and 
                    (
                        ancestor::tei:w|
                        ancestor::tei:num[not(descendant::tei:w or descendant::tei:num)]
                    )
                ">
                <xsl:variable name="content">
                    <xsl:apply-templates/>
                </xsl:variable>
                <xsl:value-of select="concat('[pc:', $content, ':pc]')"/>                
            </xsl:when>
            <xsl:when test="self::tei:num and (descendant::tei:w|descendant::tei:num)">
                <xsl:apply-templates/>
            </xsl:when>
            <xsl:when test="self::tei:num and ancestor::tei:w">
                <xsl:apply-templates/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:call-template name="token"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template match="
            text()[not(
                ancestor::tei:w|
                ancestor::tei:num|
                ancestor::tei:pc|
                ancestor::me:punct
            )]
        "/>
    <xsl:template match="tei:num[descendant::tei:w]/text()">
        <xsl:map>
            <xsl:map-entry key="'t'" select="'num'"/>
            <xsl:map-entry key="'facs'" select="''"/>
            <xsl:map-entry key="'dipl'" select="normalize-space(.)"/>
            <xsl:map-entry key="'norm'" select="''"/>
        </xsl:map>
    </xsl:template>
    <xsl:template match="tei:pb|tei:cb|tei:lb">
        <xsl:if test="not(@ed) or @ed='ms'">
            <xsl:choose>
                <xsl:when test="
                    ancestor::tei:w|
                    ancestor::tei:num[not(descendant::tei:w)]|
                    ancestor::tei:pc|
                    ancestor::me:punct
                    ">
                    <xsl:value-of select="concat('[', name(), ' n=', normalize-space(@n), ']')"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:map>
                        <xsl:map-entry key="'t'" select="name()"/>
                        <xsl:map-entry key="'n'" select="normalize-space(@n)"/>
                    </xsl:map>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:if>
    </xsl:template>
    <xsl:template match="tei:div|tei:head|tei:p">
        <xsl:map>
            <xsl:map-entry key="'t'" select="name()"/>
            <xsl:map-entry key="'open'" select="true()"/>
            <xsl:if test="self::tei:div">
                <xsl:map-entry key="'n'" select="string(@n)"/>
                <xsl:map-entry key="'type'" select="string(@type)"/>
            </xsl:if>
        </xsl:map>
        <xsl:apply-templates/>
        <xsl:map>
            <xsl:map-entry key="'t'" select="name()"/>
            <xsl:map-entry key="'open'" select="false()"/>
        </xsl:map>
    </xsl:template>
    <xsl:template match="tei:front|tei:back"/>
    <xsl:template name="token">     
        <xsl:variable name="name">
            <xsl:choose>
                <xsl:when test="self::me:punct">
                    <xsl:value-of select="'pc'"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:value-of select="name()"/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="facs">
            <xsl:apply-templates select="descendant::me:facs"/>
        </xsl:variable>
        <xsl:variable name="dipl">
            <xsl:choose>
                <xsl:when test="descendant::me:facs|descendant::me:dipl|descendant::me:norm">
                    <xsl:apply-templates select="descendant::me:dipl"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates/>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
        <xsl:variable name="norm">
            <xsl:apply-templates select="descendant::me:norm"/>
        </xsl:variable>
        <xsl:map>
            <xsl:map-entry key="'t'" select="$name"/>
            <xsl:map-entry key="'facs'" select="string($facs)"/>
            <xsl:map-entry key="'dipl'" select="string($dipl)"/>
            <xsl:map-entry key="'norm'" select="string($norm)"/>
            <xsl:if test="self::tei:w">
                <xsl:map-entry key="'lemma'" select="string(@lemma)"/>
                <xsl:map-entry key="'morph'" select="normalize-space(@me:msa)"/>                
            </xsl:if>
        </xsl:map>
    </xsl:template>
</xsl:stylesheet>
