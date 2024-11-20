<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
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
    <xsl:template match="tei:w">
        <xsl:variable name="dipl">
            <xsl:apply-templates select="descendant::me:dipl"/>
        </xsl:variable>
        <xsl:map>
            <xsl:map-entry key="'t'" select="'w'"/>
            <xsl:map-entry key="'dipl'" select="string($dipl)"/>
        </xsl:map>
    </xsl:template>
    <xsl:template match="text()[not(ancestor::tei:w)]"/>
</xsl:stylesheet>
